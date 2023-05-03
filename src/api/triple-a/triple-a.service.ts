import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { v4 as uuid } from 'uuid';
import * as qs from 'qs';
import { FiatCurrencyEnum } from '../transaction/transaction.types';
import {
  TripleADepositInterface,
  TripleADepositResponseInterface,
  TripleAWithdrawInterface,
  TripleAWithdrawResponseInterface,
} from './triple-a.types';
import { CipherTokenService } from '@api/cipher-token/cipher-token.service';

const GRANT_TYPE = 'client_credentials';

@Injectable()
export class TripleAService {
  private readonly logger = new Logger(TripleAService.name);

  private tripleAClientId;
  private tripleAClientSecret;
  private tripleAMerchatKey;
  private tripleANotifyUrl: string;
  private axiosInstance: AxiosInstance;

  constructor(
    private readonly configService: ConfigService,
    private readonly cipherTokenService: CipherTokenService,
  ) {
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

  async getAccessToken(currency: FiatCurrencyEnum): Promise<string> {
    try {
      const body = qs.stringify({
        grant_type: 'client_credentials',
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

      const { token } = await this.cipherTokenService.generateTripleAAccessToken(
        res.data.access_token,
        currency,
      );

      this.logger.log(`Triple-A Message: Access token refreshed`);

      return token;
    } catch (error) {
      const { status, statusText, data } = error.response || {};

      // TODO: Do better error handling later
      this.logger.error(`Triple-A Message: ${data?.message}` || statusText);
      // throw new HttpException(data.message || statusText, status);
    }
  }

  async deposit(dto: TripleADepositInterface): Promise<TripleADepositResponseInterface> {
    try {
      const body = {
        type: 'widget',
        merchant_key: this.tripleAMerchatKey[dto.currency],
        order_currency: dto.currency,
        order_amount: dto.amount,
        payer_id: `keecash+${dto.keecashUserId}`,
        notify_url: `${this.tripleANotifyUrl}/crypto-tx/payment-notifiy-deposit`,
        success_url: 'https://www.success.io/success.html',
        cancel_url: 'https://www.failure.io/cancel.html',
        webhook_data: {},
      };

      let accessToken;
      const tokenInDB = await this.cipherTokenService.findValidTripleAAccessToken(dto.currency);

      if (!tokenInDB) {
        const newToken = await this.getAccessToken(dto.currency);
        accessToken = newToken;
      } else {
        accessToken = tokenInDB.token;
      }

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
      let accessToken;
      const tokenInDB = await this.cipherTokenService.findValidTripleAAccessToken(currency);

      if (!tokenInDB) {
        const newToken = await this.getAccessToken(currency);
        accessToken = newToken;
      } else {
        accessToken = tokenInDB.token;
      }

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
        address: dto.walletAddress,
        name: dto.name,
        country: dto.country,
        order_id: `${dto.keecashUserId}-${uuid()}`,
        notify_url: `${this.tripleANotifyUrl}/crypto-tx/payment-notifiy-withdraw`,
      };

      let accessToken;
      const tokenInDB = await this.cipherTokenService.findValidTripleAAccessToken(dto.currency);

      if (!tokenInDB) {
        const newToken = await this.getAccessToken(dto.currency);
        accessToken = newToken;
      } else {
        accessToken = tokenInDB.token;
      }

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
      const res = await this.axiosInstance.put(
        `/payout/withdraw/${prepareRes.data.payout_reference}/local/crypto/confirm`,
        {},
        config,
      );

      return {
        crypto_amount: res.data.crypto_amount,
        exnetwork_fee_crypto_amount: res.data.network_fee_crypto_amount,
        fee: res.data.network_fee_crypto_amount,
        net_crypto_amount: res.data.net_crypto_amount,
        payout_reference: res.data.payout_reference,
        local_currency: res.data.local_currency,
        crypto_currency: res.data.crypto_currency,
        exchange_rate: res.data.exchange_rate,
      };
    } catch (error) {
      const { status, statusText, data } = error.response || {};

      throw new HttpException(`Triple-A Message: ${data.message}` || statusText, status);
    }
  }

  async getWithdrawalDetails(orderId: string, currency: FiatCurrencyEnum): Promise<any> {
    try {
      let accessToken;
      const tokenInDB = await this.cipherTokenService.findValidTripleAAccessToken(currency);

      if (!tokenInDB) {
        const newToken = await this.getAccessToken(currency);
        accessToken = newToken;
      } else {
        accessToken = tokenInDB.token;
      }

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
