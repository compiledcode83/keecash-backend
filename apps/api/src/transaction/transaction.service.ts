import { Injectable } from '@nestjs/common';
import { Transaction } from '@app/transaction';
import { FiatCurrencyEnum } from '@app/common';
import { GetWalletTransactionsQueryDto } from '@api/keecash/dto/get-wallet-transactions.query.dto';
import { TransactionRepository } from './transaction.repository';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async findOne(param: Partial<Transaction>): Promise<Transaction> {
    return this.transactionRepository.findOne({ where: param });
  }

  async findManyByFilter(
    userId: number,
    currency: FiatCurrencyEnum = null,
    query: Partial<GetWalletTransactionsQueryDto>,
  ) {
    return this.transactionRepository.findManyByFilter(userId, currency, query);
  }

  async create(data: Partial<Transaction>): Promise<Transaction> {
    return this.transactionRepository.create(data);
  }

  async save(data: any): Promise<Transaction> {
    return this.transactionRepository.save(data);
  }

  async createMany(data: Partial<Transaction>[]) {
    return this.transactionRepository.insert(data);
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
