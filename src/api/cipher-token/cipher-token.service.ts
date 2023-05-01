import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CipherToken } from './cipher-token.entity';
import { CipherTokenRepository } from './cipher-token.repository';
import { TokenTypeEnum } from './cipher-token.types';
import { FiatCurrencyEnum } from '@api/transaction/transaction.types';

@Injectable()
export class CipherTokenService {
  constructor(private readonly cipherTokenRepository: CipherTokenRepository) {}

  async findOneBy(params: Partial<CipherToken>): Promise<CipherToken> {
    return this.cipherTokenRepository.findOneBy({ ...params });
  }

  async findValidTripleAAccessToken(currency: FiatCurrencyEnum): Promise<CipherToken> {
    return this.cipherTokenRepository.findValidTripleAAccessToken(currency);
  }

  async deleteByToken(token: string): Promise<boolean> {
    const deleteResult = await this.cipherTokenRepository.delete({ token });

    return deleteResult.affected === 1;
  }

  async generateRefreshToken(tokenData: Partial<CipherToken>): Promise<string> {
    return this.cipherTokenRepository.generateRefreshToken(tokenData);
  }

  async generateResetPasswordToken(userId: number): Promise<string> {
    return this.cipherTokenRepository.generateResetPasswordToken(userId);
  }

  async generateResetPincodeToken(userId: number): Promise<string> {
    return this.cipherTokenRepository.generateResetPincodeToken(userId);
  }

  async generateCreateAccountToken(userId: number): Promise<string> {
    const doesExist = await this.cipherTokenRepository.findOne({
      where: {
        userId,
        type: TokenTypeEnum.CreateAccount,
      },
    });

    if (doesExist) {
      throw new BadRequestException('Account is already registered: CreateAccountToken exists');
    }

    return this.cipherTokenRepository.generateCreateAccountToken(userId);
  }

  async generateTripleAAccessToken(
    token: string,
    currency: FiatCurrencyEnum,
  ): Promise<CipherToken> {
    return this.cipherTokenRepository.generateTripleAAccessToken(token, currency);
  }

  async checkIfValid(token: string, type: TokenTypeEnum): Promise<number> {
    const cipherToken = await this.cipherTokenRepository.findOneBy({ token, type });

    if (!cipherToken) {
      throw new UnauthorizedException('Token is invalid');
    }

    const expiryDate = new Date(cipherToken.expireAt);
    const now = new Date();

    if (expiryDate.getTime() < now.getTime()) {
      throw new UnauthorizedException('Token is expired');
    }

    return cipherToken.userId;
  }
}
