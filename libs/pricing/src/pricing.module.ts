import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricingService } from './pricing.service';
import { CardPrice } from './entities/card-price.entity';
import { CardTopupFee } from './entities/card-topup-fee.entity';
import { CardWithdrawalFee } from './entities/card-withdrawal-fee.entity';
import { ReferralFee } from './entities/referral-fee.entity';
import { TransferFee } from './entities/transfer-fee.entity';
import { WalletDepositFee } from './entities/wallet-deposit-fee.entity';
import { WalletWithdrawalFee } from './entities/wallet-withdrawal-fee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CardPrice,
      CardTopupFee,
      CardWithdrawalFee,
      ReferralFee,
      TransferFee,
      WalletDepositFee,
      WalletWithdrawalFee,
    ]),
  ],
  providers: [PricingService],
  exports: [PricingService],
})
export class PricingModule {}
