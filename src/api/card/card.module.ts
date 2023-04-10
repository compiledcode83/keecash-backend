import { Module, forwardRef } from '@nestjs/common';
import { CardController } from './card.controller';
import { CardRepository } from './card.repository';
import { CardService } from './card.service';
import { TransactionModule } from '@api/transaction/transaction.module';
import { TransferController } from './transfer.controller';
import { DepositController } from './deposit.controller';
import { WithdrawalController } from './withdrawal.controller';
import { NotificationModule } from '../notification/notification.module';
import { UserModule } from '../user/user.module';
import { CountryFeeModule } from '../country/country-fee/country-fee.module';
import { BridgecardModule } from '../bridgecard/bridgecard.module';

@Module({
  imports: [
    TransactionModule,
    NotificationModule,
    CountryFeeModule,
    BridgecardModule,
    forwardRef(() => UserModule),
  ],
  controllers: [CardController, DepositController, WithdrawalController, TransferController],
  providers: [CardService, CardRepository],
  exports: [CardService],
})
export class CardModule {}
