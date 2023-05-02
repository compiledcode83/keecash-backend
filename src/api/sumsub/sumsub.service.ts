import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { lastValueFrom, map } from 'rxjs';

const TTLINSECS = 2400;
const SUMSUB_LEVEL_NAME = 'sumsub-signin-demo-level';

@Injectable()
export class SumsubService {
  private readonly sumsubAppToken: string;
  private readonly sumsubSecretKey: string;
  private readonly sumsubBaseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.sumsubAppToken = this.configService.get('sumsubConfig.sumsubAppToken');
    this.sumsubSecretKey = this.configService.get('sumsubConfig.sumsubSecretKey');
    this.sumsubBaseUrl = this.configService.get('sumsubConfig.sumsubBaseUrl');
  }

  async createSignature(config: any) {
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

  async createSumsubAccessToken(userId: string) {
    const config = {};
    const url = `/resources/accessTokens?userId=${userId}&ttlInSecs=${TTLINSECS}&levelName=${SUMSUB_LEVEL_NAME}`;
    const headers = {
      Accept: 'application/json',
      'X-App-Token': this.sumsubAppToken,
    };

    config['method'] = 'post';
    config['url'] = url;
    config['headers'] = headers;
    config['data'] = null;

    const updatedConfig = await this.createSignature(config);

    try {
      const res = await lastValueFrom(
        this.httpService
          .post(`${this.sumsubBaseUrl}${updatedConfig['url']}`, updatedConfig['data'], {
            headers: updatedConfig['headers'],
          })
          .pipe(map((res) => res.data?.token)),
      );

      return res;
    } catch (err) {
      throw new BadRequestException('Can not get access token');
    }
  }
}
