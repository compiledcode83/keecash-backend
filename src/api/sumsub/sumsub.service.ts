import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const SUMSUB_LEVEL_NAME = 'basic-kyc-level';

@Injectable()
export class SumsubService {
  private sumsubAppToken: string;
  private sumsubSecretKey: string;
  private sumsubAccessTokenDurationMinutes: number;
  private axiosInstance: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.sumsubAppToken = this.configService.get('sumsubConfig.sumsubAppToken');
    this.sumsubSecretKey = this.configService.get('sumsubConfig.sumsubSecretKey');
    this.sumsubAccessTokenDurationMinutes = this.configService.get(
      'sumsubConfig.sumsubAccessTokenDurationMinutes',
    );

    this.axiosInstance = axios.create({
      baseURL: this.configService.get('sumsubConfig.sumsubBaseUrl'),
      headers: {
        token: `Bearer ${this.configService.get('bridgecardConfig.authToken')}`,
      },
    });
  }

  async createSumsubAccessToken(userId: string): Promise<{ token: string; duration: number }> {
    const method = 'post';
    const ttlInSecs = this.sumsubAccessTokenDurationMinutes * 60;
    const url = `/resources/accessTokens?userId=${userId}&ttlInSecs=${ttlInSecs}&levelName=${SUMSUB_LEVEL_NAME}`;
    const data = null;

    const ts = Math.floor(Date.now() / 1000);
    const signature = crypto.createHmac('sha256', this.sumsubSecretKey);
    signature.update(ts + method.toUpperCase() + url);

    // if (data instanceof FormData) {
    //   signature.update(data.getBuffer());
    // } else if (data) {
    //   signature.update(data);
    // }

    const config: AxiosRequestConfig = {
      headers: {
        Accept: 'application/json',
        'X-App-Token': this.sumsubAppToken,
        'X-App-Access-Ts': ts,
        'X-App-Access-Sig': signature.digest('hex'),
      },
    };

    try {
      const res = await this.axiosInstance.post(url, data, config);

      return {
        token: res.data?.token,
        duration: ttlInSecs,
      };
    } catch (error) {
      const { status, statusText, data } = error.response || {};

      throw new HttpException(`Sumsub Message: ${data.message || statusText}`, status);
    }
  }
}
