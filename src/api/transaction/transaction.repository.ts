import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { FiatCurrencyEnum, TransactionStatusEnum } from './transaction.types';

@Injectable()
export class TransactionRepository extends Repository<Transaction> {
  constructor(private readonly dataSource: DataSource) {
    super(Transaction, dataSource.manager);
  }

  async getBalancesForUser(userId: number, currency: string): Promise<any> {
    const queryBuilder = await this.createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.sender', 'sender')
      .leftJoinAndSelect('transaction.receiver', 'receiver')
      .where('(sender.id = :userId OR receiver.id = :userId) AND transaction.status = :status', {
        userId,
        status: TransactionStatusEnum.Performed,
      });

    if (currency !== 'ALL') {
      queryBuilder.andWhere('transaction.currency = :currency', { currency });
    }

    queryBuilder
      .select(
        'SUM(CASE WHEN sender.id = :userId THEN -transaction.applied_amount ELSE transaction.applied_amount END)',
        'balance',
      )
      .addSelect('transaction.currency', 'currency')
      .groupBy('transaction.currency');

    if (currency === 'ALL') return queryBuilder.getRawMany();
    else return queryBuilder.getRawOne();
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
