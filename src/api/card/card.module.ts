import { Module, forwardRef } from '@nestjs/common';
import { CardController } from './card.controller';
import { CardRepository } from './card.repository';
import { CardService } from './card.service';
import { TransactionModule } from '@api/transaction/transaction.module';
import { TransferController } from './transfer.controller';
import { DepositController } from './deposit.controller';
import { WithdrawalController } from './withdrawal.controller';
import { NotificationModule } from '@api/notification/notification.module';
import { UserModule } from '@api/user/user.module';
import { CountryFeeModule } from '@api/country-fee/country-fee.module';
import { BridgecardModule } from '@api/bridgecard/bridgecard.module';
import { TripleAModule } from '@api/triple-a/triple-a.module';
import { BeneficiaryModule } from '@api/beneficiary/beneficiary.module';

@Module({
  imports: [
    TransactionModule,
    NotificationModule,
    CountryFeeModule,
    BridgecardModule,
    TripleAModule,
    forwardRef(() => BeneficiaryModule),
    forwardRef(() => UserModule),
  ],
  controllers: [CardController, DepositController, WithdrawalController, TransferController],
  providers: [CardService, CardRepository],
  exports: [CardService],
})
export class CardModule {}
