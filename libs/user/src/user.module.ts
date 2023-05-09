import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserExistsByEmailValidator } from '../../../apps/api/src/user/validator/user-exists-by-email.validator';
import { UserExistsByPhoneNumberValidator } from '../../../apps/api/src/user/validator/user-exists-by-phone-number.validator';
import { CountryExistsByNameValidator } from '../../../apps/api/src/user/validator/country-exists-by-name.validator';
import { ReferralIdExistsValidator } from '../../../apps/api/src/user/validator/referral-id-exists.validator';
import { LegitEmailValidator } from '../../../apps/api/src/user/validator/legit-email.validator';

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
