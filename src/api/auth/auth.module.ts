import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthRefreshTokenModule } from '@api/auth-refresh-token/auth-refresh-token.module';
import { UserModule } from '@api/user/user.module';
import { VerificationModule } from '@api/verification/verification.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalPasswordStrategy } from './strategies/local-pwd.strategy';
import { LocalPincodeStrategy } from './strategies/local-pin.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    AuthRefreshTokenModule,
    VerificationModule,
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
  providers: [AuthService, LocalPasswordStrategy, LocalPincodeStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
