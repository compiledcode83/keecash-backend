import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import * as FormData from 'form-data';

const SUMSUB_LEVEL_NAME = 'basic-kyc-level';

@Injectable()
export class SumsubService {
  private sumsubSecretKey: string;
  private sumsubAccessTokenDurationMinutes: number;
  private axiosInstance: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.sumsubSecretKey = this.configService.get('sumsubConfig.sumsubSecretKey');
    this.sumsubAccessTokenDurationMinutes = this.configService.get(
      'sumsubConfig.sumsubAccessTokenDurationMinutes',
    );

    this.axiosInstance = axios.create({
      baseURL: this.configService.get('sumsubConfig.sumsubBaseUrl'),
      headers: {
        Accept: 'application/json',
        'X-App-Token': this.configService.get('sumsubConfig.sumsubAppToken'),
      },
    });

    this.axiosInstance.interceptors.request.use(
      (config: AxiosRequestConfig) => this.createSignature(config),
      (error) => Promise.reject(error),
    );
  }

  createSignature(config: AxiosRequestConfig) {
    const ts = Math.floor(Date.now() / 1000);
    const signature = crypto.createHmac('sha256', this.sumsubSecretKey);
    signature.update(ts + config.method.toUpperCase() + config.url);

    if (config.data instanceof FormData) {
      signature.update(config.data.getBuffer());
    } else if (config.data) {
      signature.update(config.data);
    }

    config.headers['X-App-Access-Ts'] = ts;
    config.headers['X-App-Access-Sig'] = signature.digest('hex');

    return config;
  }

  async createSumsubAccessToken(userId: string): Promise<{ token: string; duration: number }> {
    try {
      const ttlInSecs = this.sumsubAccessTokenDurationMinutes * 60;

      const res = await this.axiosInstance.post(
        `/resources/accessTokens?userId=${userId}&ttlInSecs=${ttlInSecs}&levelName=${SUMSUB_LEVEL_NAME}`,
        null,
      );

      return {
        token: res.data?.token,
        duration: ttlInSecs,
      };
    } catch (error) {
      const { status } = error.response || {};

      throw new HttpException(`Sumsub Message: Failed to get access token`, status);
    }
  }

  async getApplicantData(userUuid: string) {
    try {
      const res = await this.axiosInstance.get(`/resources/applicants/${userUuid}/one`);

      return res.data;
    } catch (error) {
      const { status } = error.response || {};

      throw new HttpException(`Sumsub Message: Failed to get applicant data`, status);
    }
  }
}
