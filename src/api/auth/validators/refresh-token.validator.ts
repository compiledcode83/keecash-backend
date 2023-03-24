import { DateTime } from 'luxon';
import { CipherTokenService } from '@src/api/cipher-token/cipher-token.service';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'refreshTokenValidator', async: true })
export class RefreshTokenValidator implements ValidatorConstraintInterface {
  constructor(private readonly cipherTokenService: CipherTokenService) {}

  async validate(token: string, args: ValidationArguments): Promise<boolean> {
    const refreshToken = await this.cipherTokenService.findOneBy({ token });

    return refreshToken && DateTime.fromJSDate(refreshToken.expireAt) > DateTime.now();
  }

  defaultMessage() {
    return `Refresh token not found or expired`;
  }
}
