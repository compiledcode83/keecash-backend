import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { randomBytes } from 'node:crypto';
import { CipherToken } from './cipher-token.entity';
import { TokenTypeEnum } from './cipher-token.types';

@Injectable()
export class CipherTokenRepository extends Repository<CipherToken> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {
    super(CipherToken, dataSource.manager);
  }

  async generateRefreshToken(tokenData: Partial<CipherToken>): Promise<string> {
    const refreshToken = this.create({
      userId: tokenData.userId,
      token: randomBytes(32).toString('hex'),
      userAgent: tokenData.userAgent,
      ipAddress: tokenData.ipAddress,
      type: TokenTypeEnum.AuthRefresh,
      expireAt: DateTime.now()
        .plus({
          days: this.configService.get('jwtConfig.refreshTokenDurationDays'),
        })
        .toJSDate(),
    });

    const { token } = await this.save(refreshToken);

    return token;
  }

  async generateResetPasswordToken(userId: number): Promise<string> {
    const resetPasswordToken = this.create({
      userId,
      token: randomBytes(32).toString('hex'),
      type: TokenTypeEnum.ResetPassword,
      expireAt: DateTime.now()
        .plus({
          minutes: this.configService.get('jwtConfig.resetPasswordTokenDurationMinutes'),
        })
        .toJSDate(),
    });

    const { token } = await this.save(resetPasswordToken);

    return token;
  }

  async generateResetPincodeToken(userId: number): Promise<string> {
    const resetPincodeToken = this.create({
      userId,
      token: randomBytes(32).toString('hex'),
      type: TokenTypeEnum.ResetPincode,
      expireAt: DateTime.now()
        .plus({
          minutes: this.configService.get('jwtConfig.resetPasswordTokenDurationMinutes'),
        })
        .toJSDate(),
    });

    const { token } = await this.save(resetPincodeToken);

    return token;
  }

  async generateCreateAccountToken(userId: number): Promise<string> {
    const createAccountToken = this.create({
      userId,
      token: randomBytes(32).toString('hex'),
      type: TokenTypeEnum.CreateAccount,
    });

    const { token } = await this.save(createAccountToken);

    return token;
  }
}
