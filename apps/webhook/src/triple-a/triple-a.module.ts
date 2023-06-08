import { Module } from '@nestjs/common';
import { TransactionModule } from '@app/transaction';
import { TripleAModule } from '@app/triple-a';
import { OutboxModule } from '@app/outbox';
import { TripleAWebhookController } from './triple-a.controller';
import { TripleAWebhookService } from './triple-a.service';

@Module({
  imports: [TripleAModule, TransactionModule, OutboxModule],
  controllers: [TripleAWebhookController],
  providers: [TripleAWebhookService],
  exports: [TripleAWebhookService],
})
export class TripleAWebhookModule {}
