import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import axios, { AxiosInstance } from 'axios';

const TTLINSECS = 2400;
const SUMSUB_LEVEL_NAME = 'sumsub-signin-demo-level';

@Injectable()
export class SumsubService {
  private readonly sumsubAppToken: string;
  private readonly sumsubSecretKey: string;
  private axiosInstance: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.sumsubAppToken = this.configService.get('sumsubConfig.sumsubAppToken');
    this.sumsubSecretKey = this.configService.get('sumsubConfig.sumsubSecretKey');

    this.axiosInstance = axios.create({
      baseURL: this.configService.get('sumsubConfig.sumsubBaseUrl'),
      headers: {
        token: `Bearer ${this.configService.get('bridgecardConfig.authToken')}`,
      },
    });
  }

  async createSumsubAccessToken(userId: string) {
    const method = 'post';
    const url = `/resources/accessTokens?userId=${userId}&ttlInSecs=${TTLINSECS}&levelName=${SUMSUB_LEVEL_NAME}`;
    const data = null;

    const ts = Math.floor(Date.now() / 1000);
    const signature = crypto.createHmac('sha256', this.sumsubSecretKey);
    signature.update(ts + method.toUpperCase() + url);

    // if (data instanceof FormData) {
    //   signature.update(data.getBuffer());
    // } else if (data) {
    //   signature.update(data);
    // }

    const headers = {
      Accept: 'application/json',
      'X-App-Token': this.sumsubAppToken,
      'X-App-Access-Ts': ts,
      'X-App-Access-Sig': signature.digest('hex'),
    };

    try {
      const res = await this.axiosInstance.post(url, data, {
        headers,
      });

      return res.data?.token;
    } catch (error) {
      const { status, statusText, data } = error.response || {};

      throw new HttpException(`Sumsub Message: ${data.message || statusText}`, status);
    }
  }
}
