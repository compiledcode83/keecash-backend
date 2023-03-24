import { Injectable } from '@nestjs/common';
import { RefreshTokenInfo } from '@api/auth/dto/refresh-token-info.dto';
import { User } from '@api/user/user.entity';
import { AuthRefreshToken } from './auth-refresh-token.entity';
import { AuthRefreshTokenRepository } from './auth-refresh-token.repository';

@Injectable()
export class AuthRefreshTokenService {
  constructor(private readonly authRefreshTokenRepository: AuthRefreshTokenRepository) {}

  async findOneBy(params: Partial<AuthRefreshToken>): Promise<AuthRefreshToken> {
    return this.authRefreshTokenRepository.findOneBy({ ...params });
  }

  async deleteByToken(token: string): Promise<boolean> {
    const deleteResult = await this.authRefreshTokenRepository.delete({ token });

    return deleteResult.affected === 1;
  }

  async create(user: Partial<User>, refreshTokenInfo: RefreshTokenInfo): Promise<AuthRefreshToken> {
    return this.authRefreshTokenRepository.createRefreshToken(user, refreshTokenInfo);
  }

  async checkIfExpired(token: string): Promise<number | boolean> {
    const { userId, expireAt } = await this.authRefreshTokenRepository.findOneBy({ token });

    const expiryDate = new Date(expireAt);
    const now = new Date();

    if (expiryDate.getTime() < now.getTime()) return false;

    return userId;
  }
}
