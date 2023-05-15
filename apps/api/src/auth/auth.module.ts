import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TwilioModule } from '@app/twilio';
import { SumsubModule } from '@app/sumsub';
import { CipherTokenModule } from '@app/cipher-token';
import { UserModule } from '@api/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RefreshTokenValidator } from './validators/refresh-token.validator';

@Module({
  imports: [
    UserModule,
    PassportModule,
    CipherTokenModule,
    SumsubModule,
    TwilioModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('jwtConfig.secret'),
          signOptions: {
            expiresIn: `${configService.get<string>('jwtConfig.accessTokenDurationMinutes')}m`,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshTokenValidator],
})
export class AuthModule {}
