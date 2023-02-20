import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccessTokenInterfaceForAdmin } from '../auth.type';
import { Admin } from '@src/admin/admin.entity';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwtAdmin') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwtConfig.secret'),
    });
  }

  async validate(payload: Partial<Admin>): Promise<AccessTokenInterfaceForAdmin> {
    return {
      id: payload.id,
      email: payload.email,
      type: payload.type,
    };
  }
}
