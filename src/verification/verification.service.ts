import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Twilio } from 'twilio';
import { lastValueFrom, map } from 'rxjs';

const SMSCHANNEL = 'sms';
const EMAILCHANNEL = 'email';
const TTLINSECS = 2400;
const SUMSUB_LEVEL_NAME = 'sumsub-signin-demo-level';

@Injectable()
export class VerificationService {
  private twilioClient: Twilio;
  private sumsubAppToken: string;
  private sumsubSecretKey: string;
  private sumsubBaseUrl: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    const accountSid = this.configService.get<string>(
      'verificationConfig.twilioAccountSid',
    );
    const authToken = this.configService.get<string>(
      'verificationConfig.twilioAuthToken',
    );

    this.sumsubAppToken = this.configService.get<string>(
      'verificationConfig.sumsubAppToken',
    );
    this.sumsubSecretKey = this.configService.get<string>(
      'verificationConfig.sumsubSecretKey',
    );
    this.sumsubBaseUrl = this.configService.get<string>(
      'verificationConfig.sumsubBaseUrl',
    );
    this.twilioClient = new Twilio(accountSid, authToken);
  }

  async sendPhoneVerificationCode(phoneNumber: string): Promise<boolean> {
    const serviceId = this.configService.get<string>(
      'verificationConfig.twilioVerificationServiceSid',
    );
    const res = await this.twilioClient.verify
      .services(serviceId)
      .verifications.create({ to: phoneNumber, channel: SMSCHANNEL });

    if (res.status === 'pending') {
      return true;
    }
    return false;
  }

  async confirmPhoneNumberVerificationCode(
    phonenumber: string,
    code: string,
  ): Promise<boolean> {
    const serviceId = this.configService.get<string>(
      'verificationConfig.twilioVerificationServiceSid',
    );
    const result = await this.twilioClient.verify
      .services(serviceId)
      .verificationChecks.create({ to: phonenumber, code: code });
    if (!result.valid || result.status !== 'approved') {
      return false;
    }
    return true;
  }

  async sendEmailVerificationCode(email: string): Promise<boolean> {
    const serviceId = this.configService.get<string>(
      'verificationConfig.twilioVerificationServiceSid',
    );
    const res = await this.twilioClient.verify
      .services(serviceId)
      .verifications.create({ to: email, channel: EMAILCHANNEL });

    if (res.status === 'pending') {
      return true;
    }
    return false;
  }

  async confirmEmailVerificationCode(
    email: string,
    code: string,
  ): Promise<boolean> {
    const serviceId = this.configService.get<string>(
      'verificationConfig.twilioVerificationServiceSid',
    );
    const result = await this.twilioClient.verify
      .services(serviceId)
      .verificationChecks.create({ to: email, code: code });
    if (!result.valid || result.status !== 'approved') {
      return false;
    }
    return true;
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
          .post(
            `${this.sumsubBaseUrl}${updatedConfig['url']}`,
            updatedConfig['data'],
            {
              headers: updatedConfig['headers'],
            },
          )
          .pipe(map((res) => res.data?.token)),
      );
      return res;
    } catch (err) {
      throw new BadRequestException('Can not get access token');
    }
  }
}
