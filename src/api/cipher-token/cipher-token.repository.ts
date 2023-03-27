import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { randomBytes } from 'node:crypto';
import { User } from '@api/user/user.entity';
import { CipherToken } from './cipher-token.entity';
import { RefreshTokenInfo } from '@api/auth/dto/refresh-token-info.dto';
import { TokenTypeEnum } from './cipher-token.types';

@Injectable()
export class CipherTokenRepository extends Repository<CipherToken> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {
    super(CipherToken, dataSource.manager);
  }

  async createRefreshToken(
    user: Partial<User>,
    refreshTokenInfo: RefreshTokenInfo,
  ): Promise<CipherToken> {
    const refreshToken = this.create({
      userId: user.id,
      token: randomBytes(32).toString('hex'),
      userAgent: refreshTokenInfo.userAgent,
      ipAddress: refreshTokenInfo.ipAddress,
      type: TokenTypeEnum.AuthRefresh,
      expireAt: DateTime.now()
        .plus({
          days: this.configService.get('jwtConfig.refreshTokenDurationDays'),
        })
        .toJSDate(),
    });

    return this.save(refreshToken);
  }

  async createResetPasswordToken(userId: number): Promise<string> {
    const resetPasswordToken = this.create({
      userId,
      token: randomBytes(32).toString('hex'),
      type: TokenTypeEnum.ResetPassword,
      expireAt: DateTime.now()
        .plus({
          minutes: 15,
        })
        .toJSDate(),
    });

    const { token } = await this.save(resetPasswordToken);

    return token;
  }
}
