import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalPincodeStrategy extends PassportStrategy(Strategy, 'local-pin') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'emailOrPhoneNumber' });
  }

  async validate(emailOrPhoneNumber: string, pincode: string): Promise<any> {
    const validatedUser = await this.authService.validateUserByPincode(emailOrPhoneNumber, pincode);

    if (!validatedUser) throw new UnauthorizedException();

    return validatedUser;
  }
}
