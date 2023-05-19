import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CipherToken } from './cipher-token.entity';
import { CipherTokenRepository } from './cipher-token.repository';
import { TokenTypeEnum } from './cipher-token.types';
import { FiatCurrencyEnum } from '@api/transaction/transaction.types';

@Injectable()
export class CipherTokenService {
  constructor(
    private readonly cipherTokenRepository: CipherTokenRepository,
    private readonly configService: ConfigService,
  ) {}

  async findOneBy(params: Partial<CipherToken>): Promise<CipherToken> {
    return this.cipherTokenRepository.findOneBy({ ...params });
  }

  async findLastNotExpiredExchangeRate(): Promise<CipherToken> {
    return this.cipherTokenRepository.findValidToken({
      type: TokenTypeEnum.ExchangeRateEncoded,
    });
  }

  async findValidTripleAAccessToken(currency: FiatCurrencyEnum): Promise<CipherToken> {
    return this.cipherTokenRepository.findValidToken({
      type: TokenTypeEnum.TripleAAccessToken,
      currency,
    });
  }

  async findValidSumsubAccessToken(userId: number): Promise<CipherToken> {
    return this.cipherTokenRepository.findValidToken({
      type: TokenTypeEnum.SumsubAccessToken,
      userId,
    });
  }

  async deleteByToken(token: string): Promise<boolean> {
    const deleteResult = await this.cipherTokenRepository.delete({ token });

    return deleteResult.affected === 1;
  }

  async generateRefreshToken(tokenData: Partial<CipherToken>): Promise<string> {
    const { token } = await this.cipherTokenRepository.generateToken({
      ...tokenData,
      type: TokenTypeEnum.AuthRefresh,
      duration: this.configService.get('jwtConfig.refreshTokenDurationDays') * 60 * 60 * 24,
    });

    return token;
  }

  async generateResetPasswordToken(userId: number): Promise<string> {
    const { token } = await this.cipherTokenRepository.generateToken({
      userId,
      type: TokenTypeEnum.ResetPassword,
      duration: this.configService.get('jwtConfig.resetPasswordTokenDurationMinutes') * 60,
    });

    return token;
  }

  async generateResetPincodeToken(userId: number): Promise<string> {
    const { token } = await this.cipherTokenRepository.generateToken({
      userId,
      type: TokenTypeEnum.ResetPincode,
      duration: this.configService.get('jwtConfig.resetPasswordTokenDurationMinutes') * 60,
    });

    return token;
  }

  async generateCreateAccountToken({ userId, ipAddress, userAgent }): Promise<string> {
    const doesExist = await this.cipherTokenRepository.findOne({
      where: {
        userId,
        type: TokenTypeEnum.CreateAccount,
      },
    });

    if (doesExist) {
      throw new BadRequestException('Account is already registered: CreateAccountToken exists');
    }

    const { token } = await this.cipherTokenRepository.generateToken({
      userId,
      ipAddress,
      userAgent,
      type: TokenTypeEnum.CreateAccount,
    });

    return token;
  }

  async generateTripleAAccessToken(
    token: string,
    currency: FiatCurrencyEnum,
  ): Promise<CipherToken> {
    return this.cipherTokenRepository.generateToken({
      token,
      currency,
      type: TokenTypeEnum.TripleAAccessToken,
      duration: this.configService.get('tripleAConfig.tripleATokenDurationMinutes') * 60,
    });
  }

  async generateSumsubAccessToken(
    userId: number,
    token: string,
    duration: number,
  ): Promise<CipherToken> {
    return this.cipherTokenRepository.generateToken({
      userId,
      token,
      duration,
      type: TokenTypeEnum.SumsubAccessToken,
    });
  }

  async generateExchangeRateEncoded(
    exchangeRateEncoded: string,
    duration: number,
  ): Promise<CipherToken> {
    return this.cipherTokenRepository.generateToken({
      token: exchangeRateEncoded,
      duration,
      type: TokenTypeEnum.ExchangeRateEncoded,
    });
  }

  async checkIfValid(token: string, type: TokenTypeEnum): Promise<number> {
    const cipherToken = await this.cipherTokenRepository.findOneBy({ token, type });

    if (!cipherToken) {
      throw new UnauthorizedException('Token is invalid');
    }

    const expiryDate = new Date(cipherToken.expireAt);
    const now = new Date();

    if (expiryDate.getTime() < now.getTime()) {
      //we send a specific message when login token is check and is expired. That enable the frontend to check that and logout the user
      throw new UnauthorizedException(
        type === TokenTypeEnum.AuthRefresh || type === TokenTypeEnum.CreateAccount
          ? 'loginToken expired'
          : 'Token is expired',
      );
    }

    return cipherToken.userId;
  }
}
