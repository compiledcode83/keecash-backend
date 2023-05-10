import { Module } from '@nestjs/common';
import { TwilioModule } from '@app/twilio';
// import { CountryModule } from '@app/country';
import { DocumentModule } from '@app/document';
import { SumsubModule } from '@app/sumsub';
import { UserSubscriber } from '@app/user';
import { ShareholderModule } from '@app/shareholder';
import { EnterpriseProfileModule } from '@app/enterprise-profile';
import { PersonProfileModule } from '@app/person-profile';
import { ClosureReasonModule } from '@app/closure-reason';
import { BridgecardModule } from '@app/bridgecard';
import { TransactionModule } from '@api/transaction/transaction.module';
import { CardModule } from '@api/card/card.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { CountryModule } from '@api/country/country.module';

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
    CardModule,
    BridgecardModule,
    SumsubModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserSubscriber],
  exports: [UserService],
})
export class UserModule {}
