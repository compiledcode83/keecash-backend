import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { EmailComfirmationService } from './email-comfirmation.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>(
            'jwtConfig.jwtVerificationTokenSecret',
          ),
          signOptions: {
            expiresIn: configService.get<string>(
              'jwtConfig.jwtVerificationTokenExpirationTIme',
            ),
          },
        };
      },
    }),
  ],
  providers: [EmailComfirmationService],
  exports: [EmailComfirmationService],
})
export class EmailComfirmationModule {}
