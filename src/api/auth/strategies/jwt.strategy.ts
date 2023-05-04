import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserAccessTokenInterface } from '../auth.type';
import { UserStatus } from '@api/user/user.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwtConfig.secret'),
    });
  }

  async validate(payload: any): Promise<UserAccessTokenInterface> {
    if (payload.status !== UserStatus.Completed) {
      throw new UnauthorizedException('Account is not fully verified yet');
    }

    return {
      id: payload.id,
      uuid: payload.uuid,
      firstName: payload.firstName,
      lastName: payload.lastName,
      referralId: payload.referralId,
      email: payload.email,
      status: payload.status,
      type: payload.type,
      countryId: payload.countryId,
    };
  }
}
