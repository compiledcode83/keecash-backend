import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { randomBytes } from 'node:crypto';
import { User } from '@api/user/user.entity';
import { CipherToken } from './cipher-token.entity';
import { RefreshTokenInfo } from '@api/auth/dto/refresh-token-info.dto';

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
      expireAt: DateTime.now()
        .plus({
          days: this.configService.get('jwtConfig.refreshTokenDurationDays'),
        })
        .toJSDate(),
    });

    return this.save(refreshToken);
  }
}
