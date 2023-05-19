import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { CoinlayerInterface, ExchangeRateInterface } from './dto/coinlayer.types';
import { CipherTokenService } from '@api/cipher-token/cipher-token.service';

@Injectable()
export class CoinlayerService {
  private readonly logger = new Logger(CoinlayerService.name);

  private coinlayerKey: string;
  private coinlayerDurationMinutes: number;
  private axiosInstance: AxiosInstance;

  constructor(
    private readonly configService: ConfigService,
    private readonly cipherTokenService: CipherTokenService,
  ) {
    this.coinlayerKey = this.configService.get('coinlayerConfig.coinlayerKey');
    this.coinlayerDurationMinutes = this.configService.get(
      'coinlayerConfig.coinlayerRefreshExchangeRateDurationMinutes',
    );

    this.axiosInstance = axios.create({
      baseURL: this.configService.get('coinlayerConfig.coinlayerBaseUrl'),
    });
  }

  async getExchangeRate(): Promise<ExchangeRateInterface> {
    try {
      //get current exchange_rate encoded in cipher_token with expiration
      const exchangeRateEncodedCipherToken =
        await this.cipherTokenService.findLastNotExpiredExchangeRate();

      if (!exchangeRateEncodedCipherToken) {
        //if no value found, we create a new exchange rate encoded and save it in cipher token with expiry date
        const listSymbol = ['BTC', 'ETH', 'USDT'];

        const listSymbolConcatenated = listSymbol.reduce(
          (x, y, i) => `${x}${i == 0 ? '' : ','}${y}`,
          '',
        );

        const config: AxiosRequestConfig = {
          params: {
            access_key: this.coinlayerKey,
            symbols: listSymbolConcatenated,
            target: '',
          },
        };

        const exchangeRate = {};

        for (const target of ['EUR', 'USD']) {
          config.params.target = target;

          const res = (await this.axiosInstance.get(`/live`, config)).data as CoinlayerInterface;

          exchangeRate[target] = res.rates;
        }

        //save exchange rate in b64
        const exchangeRateEncoded = Buffer.from(JSON.stringify(exchangeRate)).toString('base64');

        await this.cipherTokenService.generateExchangeRateEncoded(
          exchangeRateEncoded,
          this.coinlayerDurationMinutes * 60,
        );

        return exchangeRate as ExchangeRateInterface;
      } else {
        //exchange rate encoded is always valid so we use it by decoding in base64
        const exchangeRateDecoded = JSON.parse(
          Buffer.from(exchangeRateEncodedCipherToken.token, 'base64').toString(),
        );

        return exchangeRateDecoded as ExchangeRateInterface;
      }
    } catch (error) {
      const { status, statusText, data } = error.response || {};
      // TODO: Do better error handling later
      this.logger.error(`coinlayer problem: ${data?.message}` || statusText);
      // throw new HttpException(data.message || statusText, status);
    }
  }
}
