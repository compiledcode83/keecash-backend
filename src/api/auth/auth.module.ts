import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CipherTokenModule } from '@api/cipher-token/cipher-token.module';
import { UserModule } from '@api/user/user.module';
import { SumsubModule } from '@api/sumsub/sumsub.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { TwilioModule } from '@api/twilio/twilio.module';
import { CountryModule } from '@api/country/country.module';
import { RefreshTokenValidator } from './validators/refresh-token.validator';

@Module({
  imports: [
    UserModule,
    PassportModule,
    CipherTokenModule,
    SumsubModule,
    TwilioModule,
    CountryModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('jwtConfig.secret'),
          signOptions: { expiresIn: '24h' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshTokenValidator],
  exports: [AuthService],
})
export class AuthModule {}
