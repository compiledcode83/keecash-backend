import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserExistsByEmailValidator } from './validator/user-exists-by-email.validator';
import { UserExistsByPhoneNumberValidator } from './validator/user-exists-by-phone-number.validator';
import { CountryExistsByNameValidator } from './validator/country-exists-by-name.validator';
import { ReferralIdExistsValidator } from './validator/referral-id-exists.validator';
import { LegitEmailValidator } from './validator/legit-email.validator';

@Module({
  providers: [
    UserService,
    UserRepository,
    UserExistsByEmailValidator,
    UserExistsByPhoneNumberValidator,
    CountryExistsByNameValidator,
    ReferralIdExistsValidator,
    LegitEmailValidator,
  ],
  exports: [UserService],
})
export class UserModule {}
