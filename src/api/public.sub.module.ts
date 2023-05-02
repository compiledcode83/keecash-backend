import { Module } from '@nestjs/common';
import { UserModule } from '@api/user/user.module';
import { AuthModule } from '@api/auth/auth.module';
import { CipherTokenModule } from '@api/cipher-token/cipher-token.module';
import { SumsubModule } from '@api/sumsub/sumsub.module';
import { StorageModule } from '@api/storage/storage.module';
import { BeneficiaryModule } from '@api/beneficiary/beneficiary.module';
import { CountryModule } from '@api/country/country.module';
import { DocumentModule } from '@api/user/document/document.module';
import { EnterpriseProfileModule } from '@api/user/enterprise-profile/enterprise-profile.module';
import { PersonProfileModule } from '@api/user/person-profile/person-profile.module';
import { ShareholderModule } from '@api/shareholder/shareholder.module';
import { CountryActivationModule } from '@api/country-activation/country-activation.module';
import { CountryFeeModule } from '@api/country-fee/country-fee.module';
import { BeneficiaryUserModule } from '@api/beneficiary/beneficiary-user/beneficiary-user.module';
import { BeneficiaryWalletModule } from '@api/beneficiary/beneficiary-wallet/beneficiary-wallet.module';
import { CardModule } from '@api/card/card.module';
import { TransactionModule } from '@api/transaction/transaction.module';
import { ClosureReasonModule } from '@api/closure-reason/closure-reason.module';
import { NotificationModule } from './notification/notification.module';
import { BridgecardModule } from './bridgecard/bridgecard.module';
import { TripleAModule } from './triple-a/triple-a.module';
import { TwilioModule } from './twilio/twilio.module';

@Module({
  imports: [
    AuthModule,
    CipherTokenModule,
    StorageModule,
    TripleAModule,
    ShareholderModule,
    CardModule,
    TransactionModule,
    UserModule,
    PersonProfileModule,
    EnterpriseProfileModule,
    DocumentModule,
    BeneficiaryModule,
    BeneficiaryUserModule,
    BeneficiaryWalletModule,
    CountryModule,
    CountryActivationModule,
    CountryFeeModule,
    SumsubModule,
    ClosureReasonModule,
    NotificationModule,
    BridgecardModule,
    TwilioModule,
  ],
})
export class PublicSubModule {}
