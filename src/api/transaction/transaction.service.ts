import { Injectable } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { Transaction } from './transaction.entity';
import { FiatCurrencyEnum } from './transaction.types';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async create(data: Partial<Transaction>): Promise<Transaction> {
    const txEntity = await this.transactionRepository.create(data);

    return this.transactionRepository.save(txEntity);
  }

  async getBalanceArrayByCurrency(userId: number, currency = 'ALL'): Promise<any> {
    return this.transactionRepository.getBalancesForUser(userId, currency);
  }

  async getWalletBalances(userId: number): Promise<{ eur: number; usd: number }> {
    const wallets = await this.getBalanceArrayByCurrency(userId, 'ALL');

    const eurWallet = wallets.find(({ currency }) => currency === FiatCurrencyEnum.EUR);
    const usdWallet = wallets.find(({ currency }) => currency === FiatCurrencyEnum.USD);

    return {
      eur: eurWallet ? eurWallet.balance : 0,
      usd: usdWallet ? usdWallet.balance : 0,
    };
  }

  async getAllTransactions(userId: number, currency: FiatCurrencyEnum = null) {
    return this.transactionRepository.getAllTransactions(userId, currency);
  }
}
