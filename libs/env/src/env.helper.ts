import { Injectable } from '@nestjs/common';
import { Environment } from './env.validator';

@Injectable()
export class EnvHelper {
  static verifyNodeEnv(): void {
    if (process.env.NODE_ENV === undefined) {
      process.env.NODE_ENV = 'development';
    }
  }

  static getEnvFilePath(): string {
    return `.env.${process.env.NODE_ENV?.toLowerCase()}`;
  }

  static isProduction(): boolean {
    return process.env.NODE_ENV === Environment.Production;
  }

  static isTest(): boolean {
    return process.env.NODE_ENV === Environment.Test;
  }
}
