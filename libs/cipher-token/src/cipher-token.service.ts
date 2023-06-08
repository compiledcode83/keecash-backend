import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FiatCurrencyEnum } from '@app/common';
import { CipherToken } from './cipher-token.entity';
import { CipherTokenRepository } from './cipher-token.repository';
import { TokenTypeEnum } from './cipher-token.types';

@Injectable()
export class CipherTokenService {
  constructor(
    private readonly cipherTokenRepository: CipherTokenRepository,
    private readonly configService: ConfigService,
  ) {}

  async findOneBy(params: Partial<CipherToken>): Promise<CipherToken> {
    return this.cipherTokenRepository.findOneBy({ ...params });
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

  async generateTripleAAccessToken({ token, currency, duration }): Promise<CipherToken> {
    return this.cipherTokenRepository.generateToken({
      token,
      currency,
      type: TokenTypeEnum.TripleAAccessToken,
      duration,
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
