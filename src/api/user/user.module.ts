import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwilioModule } from '@api/twilio/twilio.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserExistsByEmailValidator } from './validator/user-exists-by-email.validator';
import { UserExistsByPhoneNumberValidator } from './validator/user-exists-by-phone-number.validator';
import { CountryExistsByNameValidator } from './validator/country-exists-by-name.validator';
import { ReferralIdExistsValidator } from './validator/referral-id-exists.validator';
import { LegitEmailValidator } from './validator/legit-email.validator';
import { CountryModule } from '@api/country/country.module';
import { DocumentModule } from '@api/user/document/document.module';
import { EnterpriseProfileModule } from '@api/user/enterprise-profile/enterprise-profile.module';
import { PersonProfileModule } from '@api/user/person-profile/person-profile.module';
import { ShareholderModule } from '@api/shareholder/shareholder.module';
import { ClosureReasonModule } from '@api/closure-reason/closure-reason.module';
import { TransactionModule } from '@api/transaction/transaction.module';
import { CardModule } from '@api/card/card.module';
import { BridgecardModule } from '@api/bridgecard/bridgecard.module';
import { User } from './user.entity';
import { UserSubscriber } from './user.subscriber';
import { SumsubModule } from '@api/sumsub/sumsub.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
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
    SumsubModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    UserSubscriber,
    UserExistsByEmailValidator,
    UserExistsByPhoneNumberValidator,
    CountryExistsByNameValidator,
    ReferralIdExistsValidator,
    LegitEmailValidator,
  ],
  exports: [UserService],
})
export class UserModule {}
