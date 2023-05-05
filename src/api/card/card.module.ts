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
import { HistoryController } from './history.controller';
import { WebhookController } from './webhook.controller';
import { CreateCardController } from './create-card.controller';
import { TopupCardController } from './topup-card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './card.entity';
import { CardSubscriber } from './card.subscriber';

@Module({
  imports: [
    TypeOrmModule.forFeature([Card]),
    TransactionModule,
    NotificationModule,
    CountryFeeModule,
    BridgecardModule,
    TripleAModule,
    forwardRef(() => BeneficiaryModule),
    forwardRef(() => UserModule),
  ],
  controllers: [
    CardController,
    DepositController,
    WithdrawalController,
    TransferController,
    HistoryController,
    WebhookController,
    CreateCardController,
    TopupCardController,
  ],
  providers: [CardService, CardRepository, CardSubscriber],
  exports: [CardService],
})
export class CardModule {}
