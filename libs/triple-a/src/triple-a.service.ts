import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import * as qs from 'qs';
import { CipherTokenService } from '@app/cipher-token';
import { FiatCurrencyEnum } from '@app/common';
import {
  TripleADepositInterface,
  TripleADepositResponseInterface,
  TripleAWithdrawInterface,
  TripleAWithdrawResponseInterface,
} from './triple-a.types';

const GRANT_TYPE = 'client_credentials';

@Injectable()
export class TripleAService {
  private readonly logger = new Logger(TripleAService.name);

  private isSandboxMode: boolean;
  private tripleAClientId: { USD: string; EUR: string };
  private tripleAClientSecret: { USD: string; EUR: string };
  private tripleAMerchatKey: { USD: string; EUR: string };
  private tripleANotifyUrl: string;
  private axiosInstance: AxiosInstance;

  constructor(
    private readonly configService: ConfigService,
    private readonly cipherTokenService: CipherTokenService,
  ) {
    this.isSandboxMode = this.configService.get('appConfig.environment') === 'development';
    this.tripleAClientId = {
      USD: this.configService.get('tripleAConfig.tripleAUSDClientId'),
      EUR: this.configService.get('tripleAConfig.tripleAEURClientId'),
    };
    this.tripleAClientSecret = {
      USD: this.configService.get('tripleAConfig.tripleAUSDClientSecret'),
      EUR: this.configService.get('tripleAConfig.tripleAEURClientSecret'),
    };
    this.tripleAMerchatKey = {
      USD: this.configService.get('tripleAConfig.tripleAUSDMerchantKey'),
      EUR: this.configService.get('tripleAConfig.tripleAEURMerchantKey'),
    };
    this.tripleANotifyUrl = this.configService.get('tripleAConfig.tripleANotifyUrl');

    this.axiosInstance = axios.create({
      baseURL: this.configService.get('tripleAConfig.tripleAApiBaseUrl'),
    });
  }

  async delay(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }

  async requestNewAccessToken(currency: FiatCurrencyEnum): Promise<string> {
    try {
      const body = qs.stringify({
        grant_type: GRANT_TYPE,
        scope: 'client-credentials',
      });

      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${this.tripleAClientId[currency]}:${this.tripleAClientSecret[currency]}`,
          ).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };

      const res = await this.axiosInstance.post('/oauth/token', body, config);

      const { token } = await this.cipherTokenService.generateTripleAAccessToken({
        token: res.data.access_token,
        currency,
        duration: res.data.expires_in,
      });

      this.logger.log(`Triple-A Message: Access token refreshed`);

      return token;
    } catch (error) {
      const { status, statusText, data } = error.response || {};

      // TODO: Do better error handling later
      this.logger.error(`Triple-A Message: ${data?.message}` || statusText);
      // throw new HttpException(data.message || statusText, status);
    }
  }

  async getAccessToken(currency: FiatCurrencyEnum): Promise<string> {
    let accessToken;
    const tokenInDB = await this.cipherTokenService.findValidTripleAAccessToken(currency);

    if (!tokenInDB) {
      const newToken = await this.requestNewAccessToken(currency);
      accessToken = newToken;
    } else {
      accessToken = tokenInDB.token;
    }

    return accessToken;
  }

  async deposit(dto: TripleADepositInterface): Promise<TripleADepositResponseInterface> {
    try {
      const body = {
        type: 'widget',
        merchant_key: this.tripleAMerchatKey[dto.currency],
        order_currency: dto.currency,
        order_amount: dto.amount,
        payer_id: `keecash+${dto.userUuid}`,
        notify_url: `${this.tripleANotifyUrl}/crypto-tx/payment-notifiy-deposit`,
        success_url: 'https://www.success.io/success.html',
        cancel_url: 'https://www.failure.io/cancel.html',
        webhook_data: dto.webhookData,
        notify_email: 'ryan.kennedy@keecash.com',
      };

      const accessToken = await this.getAccessToken(dto.currency);
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const res = await this.axiosInstance.post('/payment', body, config);

      return {
        hosted_url: res.data.hosted_url,
        expires_in: res.data.expires_in,
        payment_reference: res.data.payment_reference,
      };
    } catch (error) {
      const { status, statusText, data } = error.response || {};

      throw new HttpException(`Triple-A Message: ${data.message}` || statusText, status);
    }
  }

  async getDepositDetails(paymentReference: string, currency: FiatCurrencyEnum): Promise<any> {
    try {
      const accessToken = await this.getAccessToken(currency);

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const res = await this.axiosInstance.get(`/payment/${paymentReference}`, config);

      return res.data;
    } catch (error) {
      const { status, statusText, data } = error.response || {};

      throw new HttpException(`Triple-A Message: ${data.message}` || statusText, status);
    }
  }

  async withdraw(dto: TripleAWithdrawInterface): Promise<TripleAWithdrawResponseInterface> {
    try {
      const prepareBody = {
        merchant_key: this.tripleAMerchatKey[dto.currency],
        email: dto.email,
        withdraw_currency: dto.currency,
        withdraw_amount: dto.amount,
        crypto_currency: dto.cryptocurrency,
        remarks: dto.reason,
        address: dto.walletAddress,
        name: dto.name,
        country: dto.country,
        // notify_url: `${this.tripleANotifyUrl}/crypto-tx/payment-notifiy-withdraw`,
        notify_url: 'https://webhook.site/530e2e3a-378b-4bfc-8409-d561d739ad41',
        notify_email: 'ryan.kennedy@keecash.com',
      };

      const accessToken = await this.getAccessToken(dto.currency);
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      // Prepare a payout
      const prepareRes = await this.axiosInstance.post(
        '/payout/withdraw/local/crypto/direct',
        prepareBody,
        config,
      );

      // Confirm the payout
      const confirmRes = await this.axiosInstance.put(
        `/payout/withdraw/${prepareRes.data.payout_reference}/local/crypto/confirm`,
        {},
        config,
      );

      return {
        crypto_amount: confirmRes.data.crypto_amount,
        exnetwork_fee_crypto_amount: confirmRes.data.network_fee_crypto_amount,
        fee: confirmRes.data.network_fee_crypto_amount,
        net_crypto_amount: confirmRes.data.net_crypto_amount,
        payout_reference: confirmRes.data.payout_reference,
        local_currency: confirmRes.data.local_currency,
        crypto_currency: confirmRes.data.crypto_currency,
        exchange_rate: confirmRes.data.exchange_rate,
      };
    } catch (error) {
      const { status, statusText, data } = error.response || {};

      throw new HttpException(`Triple-A Message: ${data.message}` || statusText, status);
    }
  }

  async getWithdrawalDetails(orderId: string, currency: FiatCurrencyEnum): Promise<any> {
    try {
      const accessToken = await this.getAccessToken(currency);
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const res = await this.axiosInstance.get(`/payout/withdraw/order/${orderId}`, config);

      return res.data;
    } catch (error) {
      const { status, statusText, data } = error.response || {};

      throw new HttpException(`Triple-A Message: ${data.message}` || statusText, status);
    }
  }
}
