import { Injectable } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async create(data: Partial<Transaction>): Promise<Transaction> {
    return this.transactionRepository.create(data);
  }
}
