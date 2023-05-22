import { Module } from '@nestjs/common';
import { TransactionModule } from '@app/transaction';
import { UserModule } from '@app/user';
import { TripleAModule } from '@app/triple-a';
import { PricingModule } from '@app/pricing';
import { TripleAWebhookController } from './triple-a.controller';
import { TripleAWebhookService } from './triple-a.service';

@Module({
  imports: [TripleAModule, UserModule, TransactionModule, PricingModule],
  controllers: [TripleAWebhookController],
  providers: [TripleAWebhookService],
  exports: [TripleAWebhookService],
})
export class TripleAWebhookModule {}
