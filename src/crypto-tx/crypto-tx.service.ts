import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CryptoDepositDto } from './dto/crypto-deposit.dto';
import { lastValueFrom, map } from 'rxjs';
import { CryptoPaymentNotifyDto } from './dto/crypto-payment-notify.dto';
import { CryptoTxRepository } from './crypto-tx-repository';
import { CryptoTx } from './crypto-tx.entity';
import { UserService } from '@src/user/user.service';

const GRANT_TYPE = 'client_credentials';

@Injectable()
export class CryptoTxService {
  private tripleaClientId: string;
  private tripleaClientSecret: string;
  private tripleaMerchatKey: string;
  private tripleaTestApiId: string;
  private tripleaAccessToken: string;
  private tripleaNotifyUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly cryptoTxRepository: CryptoTxRepository,
    private readonly userService: UserService,
  ) {
    this.tripleaClientId = this.configService.get<string>(
      'cryptoConfig.tripleaClientId',
    );
    this.tripleaClientSecret = this.configService.get<string>(
      'cryptoConfig.tripleaClientSecret',
    );
    this.tripleaMerchatKey = this.configService.get<string>(
      'cryptoConfig.tripleaMerchantKey',
    );
    this.tripleaTestApiId = this.configService.get<string>(
      'cryptoConfig.tripleaTestApiId',
    );
    this.tripleaNotifyUrl = this.configService.get<string>(
      'cryptoConfig.tripleaNotifyUrl',
    );
    this.getAccessToken();
  }

  async getAccessToken() {
    try {
      const requestBody = {
        client_id: this.tripleaClientId,
        client_secret: this.tripleaClientSecret,
        grant_type: GRANT_TYPE,
      };
      const requestHeader = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${this.tripleaMerchatKey}`,
      };
      const res = await lastValueFrom(
        this.httpService
          .post('https://api.triple-a.io/api/v2/oauth/token', requestBody, {
            headers: requestHeader,
          })
          .pipe(map((res) => res.data?.access_token)),
      );
      this.tripleaAccessToken = res;
    } catch (err) {
      throw new BadRequestException('Can not get access token');
    }
  }

  async cryptoDeposit(
    body: CryptoDepositDto,
    userEmail: string,
  ): Promise<{ hosted_url: string; expires_in: number } | boolean> {
    try {
      const requestBody = {
        type: 'widget',
        merchant_key: this.tripleaMerchatKey,
        order_currency: body.currency_name,
        order_amount: body.amount,
        payer_id: userEmail,
        // sandbox: true,
        // account_api_id: this.tripleaTestApiId,
        // notify_url: 'https://webhook.site/3aa117e0-a731-4952-800d-303f991ac886',
        notify_url: `${this.tripleaNotifyUrl}/crypto-tx/payment-notifiy`,
      };
      const requestHeader = {
        Authorization: `Bearer ${this.tripleaAccessToken}`,
      };
      const res = await lastValueFrom(
        this.httpService
          .post('https://api.triple-a.io/api/v2/payment', requestBody, {
            headers: requestHeader,
          })
          .pipe(map((res) => res.data)),
      );
      return { hosted_url: res.hosted_url, expires_in: res.expires_in };
    } catch (err) {
      return false;
    }
  }

  async paymentNotify(body: CryptoPaymentNotifyDto) {
    const requestHeader = {
      Authorization: `Bearer ${this.tripleaAccessToken}`,
    };
    const res = await lastValueFrom(
      this.httpService
        .get(
          `https://api.triple-a.io/api/v2/payment/${body.payment_reference}`,
          { headers: requestHeader },
        )
        .pipe(map((res) => res.data)),
    );
    if (res.payment_tier === 'good') {
      const userSender = await this.userService.findByEmail(res.payer_id);
      const description = `You deposited ${res.crypto_amount} ${res.display_crypto_currency}`;
      const createCryptoTx: Partial<CryptoTx> = {
        userSenderId: userSender.id,
        userReceiverId: 1,
        amount: res.order_amount,
        currencyName: res.payment_currency,
        description: description,
        paymentReference: res.payment_reference,
      };
    }
  }

  // async createCryptoTx(body: Partial<CryptoTx>) {}
}
