import { Module } from '@nestjs/common';
import { TwilioModule } from '@app/twilio';
import { CountryModule } from '@app/country';
import { SumsubModule } from '@app/sumsub';
import { UserSubscriber } from '@app/user';
import { PersonProfileModule } from '@app/person-profile';
import { ClosureReasonModule } from '@app/closure-reason';
import { BridgecardModule } from '@app/bridgecard';
import { OutboxModule } from '@app/outbox';
import { TransactionModule } from '@api/transaction/transaction.module';
import { CardModule } from '@api/card/card.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserExistsByEmailValidator } from './validator/user-exists-by-email.validator';
import { UserExistsByPhoneNumberValidator } from './validator/user-exists-by-phone-number.validator';
import { CountryExistsByNameValidator } from './validator/country-exists-by-name.validator';
import { ReferralIdExistsValidator } from './validator/referral-id-exists.validator';
import { LegitEmailValidator } from './validator/legit-email.validator';
<<<<<<< HEAD:apps/api/src/user/user.module.ts
=======
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
import { AuthModule } from '@api/auth/auth.module';
import { BeneficiaryUserModule } from '@api/beneficiary/beneficiary-user/beneficiary-user.module';
import { StorageModule } from '@api/storage/storage.module';
>>>>>>> 381621e06e83efe140d01ba95f21884ffdfb849c:src/api/user/user.module.ts

@Module({
  imports: [
    TwilioModule,
    CountryModule,
    PersonProfileModule,
<<<<<<< HEAD:apps/api/src/user/user.module.ts
    ClosureReasonModule,
    TransactionModule,
    CardModule,
    BridgecardModule,
    SumsubModule,
    OutboxModule,
=======
    ShareholderModule,
    forwardRef(() => ClosureReasonModule),
    TransactionModule,
    forwardRef(() => CardModule),
    forwardRef(() => AuthModule),
    forwardRef(() => BeneficiaryUserModule),
    BridgecardModule,
    SumsubModule,
    StorageModule,
>>>>>>> 381621e06e83efe140d01ba95f21884ffdfb849c:src/api/user/user.module.ts
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
  exports: [UserService, UserRepository],
})
export class UserModule {}
