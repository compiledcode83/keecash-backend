import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Request } from 'express';

@Injectable()
export class LocalPinStrategy extends PassportStrategy(Strategy, 'local-pin') {
  constructor(private authService: AuthService) {
    super({ usernameField: null, passwordField: 'pincode' });
  }

  async validate(username: string, pincode: string, req: Request): Promise<any> {
    const bearerRefreshToken = req.headers.authorization.split(' ')[1];

    const userId = await this.authRefreshTokenService.checkIfExpired(bearerRefreshToken);

    if (!userId) throw new UnauthorizedException();

    const validatedUser = await this.authService.validateUserByPincode(userId, pincode);

    if (!validatedUser) throw new UnauthorizedException('Username and password does not match');

    return validatedUser;
  }
}
