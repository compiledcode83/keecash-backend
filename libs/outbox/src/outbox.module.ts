import { Module } from '@nestjs/common';
import { OutboxRepository } from './outbox.repository';
import { OutboxService } from './outbox.service';

@Module({
  providers: [OutboxService, OutboxRepository],
  exports: [OutboxService],
})
export class OutboxModule {}
