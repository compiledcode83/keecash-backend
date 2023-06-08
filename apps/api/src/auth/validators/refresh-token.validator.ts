import { DateTime } from 'luxon';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CipherTokenService } from '@app/cipher-token';

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
