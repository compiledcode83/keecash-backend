import { Injectable } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { FiatCurrencyEnum } from '../crypto-tx/crypto-tx.types';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async getBalanceArrayByCurrency(
    userId: number,
  ): Promise<{ currency: FiatCurrencyEnum; balance: number }[]> {
    return this.transactionRepository.getBalancesForUser(userId);
  }

  async getBalanceForUser(userId: number): Promise<{ eur: number; usd: number }> {
    const wallets = await this.getBalanceArrayByCurrency(userId);

    return {
      eur: wallets.find(({ currency }) => currency === FiatCurrencyEnum.EUR).balance,
      usd: wallets.find(({ currency }) => currency === FiatCurrencyEnum.USD).balance,
    };
  }

  async getAllTransactions(userId: number, currency: FiatCurrencyEnum = null) {
    return this.transactionRepository.getAllTransactions(userId, currency);
  }
}
