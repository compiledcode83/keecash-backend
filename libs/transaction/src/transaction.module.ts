import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './transaction.repository';

@Module({
  providers: [TransactionService, TransactionRepository],
  exports: [TransactionService],
})
export class TransactionModule {}
