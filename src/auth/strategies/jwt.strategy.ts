import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@src/user/table/user.entity';
import { AccessTokenInterface } from '../auth.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwtConfig.secret'),
    });
  }

  async validate(payload: Partial<User>): Promise<AccessTokenInterface> {
    return {
      id: payload.id,
      firstName: payload.firstName,
      secondName: payload.secondName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      accountType: payload.accountType,
    };
  }
}
