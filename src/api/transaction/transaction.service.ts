import { Injectable } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { Transaction } from './transaction.entity';
import { FiatCurrencyEnum } from './transaction.types';
import { GetWalletTransactionsDto } from '@api/card/dto/get-wallet-transactions.dto';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async findOne(param: Partial<Transaction>): Promise<Transaction> {
    return this.transactionRepository.findOne({ where: param });
  }

  async findManyByFilter(
    userId: number,
    currency: FiatCurrencyEnum = null,
    query: GetWalletTransactionsDto,
  ) {
    return this.transactionRepository.findManyByFilter(userId, currency, query);
  }

  async create(data: Partial<Transaction>): Promise<Transaction> {
    const txEntity = await this.transactionRepository.create(data);

    return this.transactionRepository.save(txEntity);
  }

  async update(param: any, data: Partial<Transaction>) {
    return this.transactionRepository.update(param, data);
  }

  async getBalanceArrayByCurrency(userId: number, currency = 'ALL'): Promise<any> {
    return this.transactionRepository.getBalancesForUser(userId, currency);
  }

  async getWalletBalances(userId: number): Promise<{ eur: number; usd: number }> {
    const wallets = await this.getBalanceArrayByCurrency(userId, 'ALL');

    const eurWallet = wallets.find(({ currency }) => currency === FiatCurrencyEnum.EUR);
    const usdWallet = wallets.find(({ currency }) => currency === FiatCurrencyEnum.USD);

    return {
      eur: eurWallet ? parseFloat(eurWallet.balance.toFixed(2)) : 0,
      usd: usdWallet ? parseFloat(usdWallet.balance.toFixed(2)) : 0,
    };
  }
}
