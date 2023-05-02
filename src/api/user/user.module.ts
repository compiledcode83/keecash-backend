import { Module, forwardRef } from '@nestjs/common';
import { TwilioModule } from '@api/twilio/twilio.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserExistsByEmailValidator } from './validator/user-exists-by-email.validator';
import { UserExistsByPhoneNumberValidator } from './validator/user-exists-by-phone-number.validator';
import { CountryExistsByNameValidator } from './validator/country-exists-by-name.validator';
import { ReferralIdExistsValidator } from './validator/referral-id-exists.validator';
import { CountryModule } from '@api/country/country.module';
import { DocumentModule } from '@api/user/document/document.module';
import { EnterpriseProfileModule } from '@api/user/enterprise-profile/enterprise-profile.module';
import { PersonProfileModule } from '@api/user/person-profile/person-profile.module';
import { ShareholderModule } from '@api/shareholder/shareholder.module';
import { ClosureReasonModule } from '../closure-reason/closure-reason.module';
import { TransactionModule } from '../transaction/transaction.module';
import { CardModule } from '../card/card.module';
import { BridgecardModule } from '../bridgecard/bridgecard.module';
import { CipherTokenModule } from '../cipher-token/cipher-token.module';

@Module({
  imports: [
    TwilioModule,
    CountryModule,
    DocumentModule,
    EnterpriseProfileModule,
    PersonProfileModule,
    ShareholderModule,
    ClosureReasonModule,
    TransactionModule,
    forwardRef(() => CardModule),
    BridgecardModule,
    CipherTokenModule,
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
