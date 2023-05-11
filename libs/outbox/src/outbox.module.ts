import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Outbox } from './outbox.entity';
import { OutboxRepository } from './outbox.repository';
import { OutboxService } from './outbox.service';

@Module({
  //   imports: [TypeOrmModule.forFeature([Outbox])],
  providers: [OutboxService, OutboxRepository],
  exports: [OutboxService],
})
export class OutboxModule {}
