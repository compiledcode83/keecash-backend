import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { TransactionStatusEnum } from './transaction.types';
import { FiatCurrencyEnum } from '../crypto-tx/crypto-tx.types';

@Injectable()
export class TransactionRepository extends Repository<Transaction> {
  constructor(private readonly dataSource: DataSource) {
    super(Transaction, dataSource.manager);
  }

  async getBalancesForUser(userId: number): Promise<any[]> {
    const result = await this.createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.sender', 'sender')
      .leftJoinAndSelect('transaction.receiver', 'receiver')
      .where('(sender.id = :userId OR receiver.id = :userId) AND transaction.status = :status', {
        userId,
        status: TransactionStatusEnum.Performed,
      })
      .select(
        'SUM(CASE WHEN sender.id = :userId THEN -transaction.amount ELSE transaction.amount END)',
        'balance',
      )
      .addSelect('transaction.currency', 'currency')
      .groupBy('transaction.currency')
      .getRawMany();

    return result;
  }

  async getAllTransactions(userId: number, currency: FiatCurrencyEnum = null) {
    const queryBuilder = this.createQueryBuilder('transaction')
      .select([
        'expiry_date AS date',
        'currency',
        'external_tx_method AS from',
        'amount AS from_amount',
      ])
      .where({ status: TransactionStatusEnum.Performed });

    if (currency) queryBuilder.where({ currency });

    const result = await queryBuilder
      .where({ senderId: userId })
      .orWhere({ receiverId: userId })
      .groupBy('id, currency')
      .getRawMany();

    return result;
  }
}
