import { Module, forwardRef } from '@nestjs/common';
import { BridgecardModule } from '@app/bridgecard';
import { PricingModule } from '@app/pricing';
import { TripleAModule } from '@app/triple-a';
import { TransactionModule } from '@api/transaction/transaction.module';
import { UserModule } from '@api/user/user.module';
import { BeneficiaryModule } from '@api/beneficiary/beneficiary.module';
import { NotificationModule } from '@api/notification/notification.module';
import { KeecashService } from './keecash.service';
import { HistoryController } from './history.controller';
import { WebhookController } from './webhook.controller';
import { TopupCardController } from './topup-card.controller';
import { CardController } from './card.controller';
import { TransferController } from './transfer.controller';
import { DepositController } from './deposit.controller';
import { WithdrawalController } from './withdrawal.controller';

@Module({
  imports: [
    TransactionModule,
    NotificationModule,
    BridgecardModule,
    TripleAModule,
    forwardRef(() => BeneficiaryModule),
    forwardRef(() => UserModule),
    PricingModule,
  ],
  controllers: [
    CardController,
    DepositController,
    WithdrawalController,
    TransferController,
    HistoryController,
    WebhookController,
    TopupCardController,
  ],
  providers: [KeecashService],
  exports: [KeecashService],
})
export class KeecashModule {}
