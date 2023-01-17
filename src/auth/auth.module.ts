import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AdminModule } from '@src/admin/admin.module';
import { AuthRefreshTokenModule } from '@src/auth-refresh-token/auth-refresh-token.module';
import { UserModule } from '@src/user/user.module';
import { VerificationModule } from '@src/verification/verification.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminStrategy } from './strategies/admin.strategy';
import { JwtAdminStrategy } from './strategies/jwt-admin.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    AuthRefreshTokenModule,
    VerificationModule,
    AdminModule,
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
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    AdminStrategy,
    JwtAdminStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
