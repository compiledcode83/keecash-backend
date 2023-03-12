import { Module } from '@nestjs/common';
import { AdminAuthService } from './auth.service';
import { AdminAuthController } from './auth.controller';
import { JwtAdminStrategy } from './strategies/jwt-admin.strategy';
import { AdminStrategy } from './strategies/admin.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminModule } from '@admin/admin/admin.module';
import { VerificationModule } from '@api/verification/verification.module';

@Module({
  imports: [
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
    AdminModule,
    VerificationModule,
  ],
  controllers: [AdminAuthController],
  providers: [AdminAuthService, JwtAdminStrategy, AdminStrategy],
  exports: [AdminAuthService],
})
export class AdminAuthModule {}
