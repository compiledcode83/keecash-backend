import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@api/user/user.entity';
import { UserAccessTokenInterface } from '../auth.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwtConfig.secret'),
    });
  }

  async validate(payload: Partial<User>): Promise<Partial<UserAccessTokenInterface>> {
    return {
      id: payload.id,
      firstName: payload.firstName,
      secondName: payload.secondName,
      email: payload.email,
      status: payload.status,
      type: payload.type,
    };
  }
}
