import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { v4 as uuid } from 'uuid';
import { FiatCurrencyEnum } from '../transaction/transaction.types';
import {
  TripleADepositInterface,
  TripleADepositResponseInterface,
  TripleAWithdrawInterface,
  TripleAWithdrawResponseInterface,
} from './triple-a.types';
import { Cron } from '@nestjs/schedule';

const GRANT_TYPE = 'client_credentials';

@Injectable()
export class TripleAService {
  private readonly logger = new Logger(TripleAService.name);

  private tripleAClientId;
  private tripleAClientSecret;
  private tripleAMerchatKey;
  private tripleAAccessToken;
  private tripleANotifyUrl: string;
  private axiosInstance: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
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
    this.tripleAAccessToken = { USD: '', EUR: '' };

    this.axiosInstance = axios.create({
      baseURL: this.configService.get('tripleAConfig.tripleAApiBaseUrl'),
    });
  }

  async delay(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }

  async getAccessToken(currency: FiatCurrencyEnum) {
    try {
      const body = {
        client_id: this.tripleAClientId[currency],
        client_secret: this.tripleAClientSecret[currency],
        grant_type: GRANT_TYPE,
      };

      const config = {
        headers: {
          Authorization: `Bearer ${this.tripleAMerchatKey[currency]}`,
        },
      };

      const res = await this.axiosInstance.post('/oauth/token', body, config);

      this.tripleAAccessToken[currency] = res.data.access_token;
    } catch (error) {
      const { status, statusText, data } = error.response || {};

      // TODO: Do better error handling later
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

      const config = {
        headers: {
          Authorization: `Bearer ${this.tripleAAccessToken[dto.currency]}`,
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

      if (
        status === HttpStatus.UNAUTHORIZED &&
        data.message === 'Invalid token: access token has expired'
      ) {
        await this.getAccessToken(data.currency);
        await this.delay(3000); // Wait for 3 seconds
        await this.deposit(dto);
      } else {
        throw new HttpException(data.message || statusText, status);
      }
    }
  }

  async getDepositDetails(paymentReference: string, currency: FiatCurrencyEnum): Promise<any> {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${this.tripleAAccessToken[currency]}`,
        },
      };

      const res = await this.axiosInstance.get(`/payment/${paymentReference}`, config);

      return res.data;
    } catch (error) {
      const { status, statusText, data } = error.response || {};

      if (
        status === HttpStatus.UNAUTHORIZED &&
        data.message === 'Invalid token: access token has expired'
      ) {
        await this.getAccessToken(currency);
        await this.delay(3000); // Wait for 3 seconds
        await this.getDepositDetails(paymentReference, currency);
      } else {
        throw new HttpException(data.message || statusText, status);
      }
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

      const config = {
        headers: {
          Authorization: `Bearer ${this.tripleAAccessToken[dto.currency]}`,
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

      if (
        status === HttpStatus.UNAUTHORIZED &&
        data.message === 'Invalid token: access token has expired'
      ) {
        await this.getAccessToken(data.currency);
        await this.delay(3000); // Wait for 3 seconds
        await this.withdraw(dto);
      } else {
        throw new HttpException(data.message || statusText, status);
      }
    }
  }

  async getWithdrawalDetails(orderId: string, currency: FiatCurrencyEnum): Promise<any> {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${this.tripleAAccessToken[currency]}`,
        },
      };

      const res = await this.axiosInstance.get(`/payout/withdraw/order/${orderId}`, config);

      return res.data;
    } catch (error) {
      const { status, statusText, data } = error.response || {};

      if (
        status === HttpStatus.UNAUTHORIZED &&
        data.message === 'Invalid token: access token has expired'
      ) {
        await this.getAccessToken(currency);
        await this.delay(3000); // Wait for 3 seconds
        await this.getWithdrawalDetails(orderId, currency);
      } else {
        throw new HttpException(data.message || statusText, status);
      }
    }
  }

  // Refresh access token every 55 minutes, because access token expires in 1 hour
  @Cron('* */55 * * * *', {
    name: 'refresh_triple_a_access_token',
  })
  async refreshAccessToken() {
    try {
      await Promise.all(
        Object.keys(FiatCurrencyEnum).map((currency) =>
          this.getAccessToken(currency as FiatCurrencyEnum),
        ),
      );

      this.logger.log('Refreshed TripleA access token');
    } catch (error) {
      const { status, statusText, data } = error.response || {};

      throw new HttpException(data.message || statusText, status);
    }
  }
}
