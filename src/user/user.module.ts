import { Module } from '@nestjs/common';
import { StorageModule } from '@src/storage/storage.module';
import { VerificationModule } from '@src/verification/verification.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserExistsByEmailValidator } from './validator/user-exists-by-email.validator';
import { UserExistsByPhoneNumberValidator } from './validator/user-exists-by-phone-number.validator';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { CountryExistsByNameValidator } from './validator/country-exists-by-name.validator';
import { ReferralIdExistsValidator } from './validator/referral-id-exists.validator';
import { CountryModule } from '@src/country/country.module';
import { DocumentModule } from '@src/user/document/document.module';
import { EnterpriseProfileModule } from '@src/user/enterprise-profile/enterprise-profile.module';
import { PersonProfileModule } from '@src/user/person-profile/person-profile.module';
import { ShareholderModule } from '@src/shareholder/shareholder.module';

@Module({
  imports: [
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
    CountryModule,
    DocumentModule,
    EnterpriseProfileModule,
    PersonProfileModule,
    ShareholderModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    UserExistsByEmailValidator,
    UserExistsByPhoneNumberValidator,
    CountryExistsByNameValidator,
    ReferralIdExistsValidator,
  ],
  exports: [UserService],
})
export class UserModule {}
