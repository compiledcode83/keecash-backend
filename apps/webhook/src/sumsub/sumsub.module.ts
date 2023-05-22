import { Module } from '@nestjs/common';
import { SumsubWebhookService } from './sumsub.service';
import { SumsubWebhookController } from './sumsub.controller';

@Module({
  imports: [],
  controllers: [SumsubWebhookController],
  providers: [SumsubWebhookService],
  exports: [SumsubWebhookService],
})
export class SumsubWebhookModule {}
