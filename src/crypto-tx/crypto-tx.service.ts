import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CryptoDepositWithdrawDto } from './dto/crypto-deposit.dto';
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

  async getBalance(userId: number) {
    const receivedBalances = await this.cryptoTxRepository
      .createQueryBuilder('crypto_tx')
      .select(['crypto_tx.currency_name', 'SUM(crypto_tx.amount)'])
      .where(`crypto_tx.user_receiver_id = ${userId}`)
      .groupBy('currency_name')
      .getRawMany();

    const sentBalances = await this.cryptoTxRepository
      .createQueryBuilder('crypto_tx')
      .select(['crypto_tx.currency_name', 'SUM(crypto_tx.amount)'])
      .where(`crypto_tx.user_sender_id = ${userId}`)
      .groupBy('currency_name')
      .getRawMany();

    const balances = [];
    receivedBalances.map((receivedBalance) => {
      sentBalances.map((sentBalance) => {
        if (sentBalance.currency_name === receivedBalance.currency_name) {
          balances.push({
            currency_name: sentBalance.currency_name,
            amount: receivedBalance.sum - sentBalance.sum,
          });
        }
      });
    });
    return balances;
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
    body: CryptoDepositWithdrawDto,
    userEmail: string,
  ): Promise<
    | { hosted_url: string; expires_in: number; payment_reference: string }
    | boolean
  > {
    try {
      const requestBody = {
        type: 'widget',
        merchant_key: this.tripleaMerchatKey,
        order_currency: body.currency_name,
        order_amount: body.amount,
        payer_id: userEmail,
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
      return {
        hosted_url: res.hosted_url,
        expires_in: res.expires_in,
        payment_reference: res.payment_reference,
      };
    } catch (err) {
      return false;
    }
  }

  async cryptoWithdraw(
    body: CryptoDepositWithdrawDto,
    userEmail: string,
  ): Promise<
    | { hosted_url: string; expires_in: number; payment_reference: string }
    | boolean
  > {
    try {
      const requestBody = {
        merchant_key: this.tripleaMerchatKey,
        email: userEmail,
        withdraw_currency: body.currency_name,
        withdraw_amount: body.amount,

        order_currency: body.currency_name,
        order_amount: body.amount,
        payer_id: userEmail,
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
      return {
        hosted_url: res.hosted_url,
        expires_in: res.expires_in,
        payment_reference: res.payment_reference,
      };
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
        userSenderId: 1,
        userReceiverId: userSender.id,
        amount: res.order_amount,
        currencyName: res.payment_currency,
        description: description,
        paymentReference: res.payment_reference,
      };
      await this.createCryptoTx(createCryptoTx);
    }
  }

  async createCryptoTx(body: Partial<CryptoTx>): Promise<Partial<CryptoTx>> {
    const cryptoTxEntity = this.cryptoTxRepository.create(body);
    const res = await this.cryptoTxRepository.save(cryptoTxEntity);
    return res;
  }
}
