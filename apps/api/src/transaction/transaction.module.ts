import { Module } from '@nestjs/common';
import { TransactionSubscriber } from '@app/transaction';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './transaction.repository';

@Module({
  providers: [TransactionSubscriber, TransactionService, TransactionRepository],
  exports: [TransactionService],
})
export class TransactionModule {}
