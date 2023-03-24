import { Injectable } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { FiatCurrencyEnum } from '../crypto-tx/crypto-tx.types';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async getBalanceForUser(userId: number) {
    const wallets = await this.transactionRepository.getBalancesForUser(userId);

    return {
      eur: wallets.find(({ balance }) => balance === 'EUR').balance,
      usd: wallets.find(({ balance }) => balance === 'USD').balance,
    };
  }

  async getAllTransactions(userId: number, currency: FiatCurrencyEnum = null) {
    return this.transactionRepository.getAllTransactions(userId, currency);
  }
}
