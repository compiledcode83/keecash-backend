import { Injectable } from '@nestjs/common';
import { RefreshTokenInfo } from '@api/auth/dto/refresh-token-info.dto';
import { User } from '@api/user/user.entity';
import { CipherToken } from './cipher-token.entity';
import { CipherTokenRepository } from './cipher-token.repository';

@Injectable()
export class CipherTokenService {
  constructor(private readonly cipherTokenRepository: CipherTokenRepository) {}

  async findOneBy(params: Partial<CipherToken>): Promise<CipherToken> {
    return this.cipherTokenRepository.findOneBy({ ...params });
  }

  async deleteByToken(token: string): Promise<boolean> {
    const deleteResult = await this.cipherTokenRepository.delete({ token });

    return deleteResult.affected === 1;
  }

  async create(user: Partial<User>, refreshTokenInfo: RefreshTokenInfo): Promise<CipherToken> {
    return this.cipherTokenRepository.createRefreshToken(user, refreshTokenInfo);
  }

  async checkIfExpired(token: string): Promise<number | boolean> {
    const { userId, expireAt } = await this.cipherTokenRepository.findOneBy({ token });

    const expiryDate = new Date(expireAt);
    const now = new Date();

    if (expiryDate.getTime() < now.getTime()) return false;

    return userId;
  }
}
