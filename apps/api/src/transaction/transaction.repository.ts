import { Injectable } from '@nestjs/common';
import {
  TransactionRepository as CommonRepository,
  Transaction,
  TransactionStatusEnum,
} from '@app/transaction';
import { FiatCurrencyEnum } from '@app/common';
import { GetWalletTransactionsQueryDto } from '@api/keecash/dto/get-wallet-transactions.query.dto';

@Injectable()
export class TransactionRepository extends CommonRepository {
  async findManyByFilter(
    userId: number,
    currency: FiatCurrencyEnum = null,
    query: GetWalletTransactionsQueryDto,
  ): Promise<Transaction[]> {
    const queryBuilder = this.createQueryBuilder('transaction')
      .select()
      .where({ status: TransactionStatusEnum.Performed });

    if (currency) {
      queryBuilder.andWhere({ currency });
    }

    if ('fromAmount' in query && 'toAmount' in query) {
      queryBuilder.andWhere(
        `transaction.affected_amount >= ${query.fromAmount} AND transaction.affected_amount <= ${query.toAmount}`,
      );
    }

    if ('fromDate' in query && 'toDate' in query) {
      queryBuilder.andWhere(
        `transaction.created_at >= '${query.fromDate}' AND transaction.created_at <= '${query.toDate}'`,
      );
    }

    if ('txTypes' in query && query.txTypes !== 'ALL') {
      queryBuilder.andWhere(`transaction.type IN (:...txTypes)`, {
        txTypes: query.txTypes,
      });
    }

    if ('cryptoTypes' in query) {
      queryBuilder.andWhere(`transaction.crypto_type IN (:...cryptoTypes)`, {
        cryptoTypes: query.cryptoTypes,
      });
    }

    const result = await queryBuilder.andWhere({ userId }).groupBy('id, currency').getMany();

    return result;
  }

  async getBalancesForUser(userId: number, currency: string): Promise<any> {
    const queryBuilder = await this.createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.user', 'user')
      .where('user.id = :userId AND transaction.status = :status', {
        userId,
        status: TransactionStatusEnum.Performed,
      });

    if (currency !== 'ALL') {
      queryBuilder.andWhere('transaction.currency = :currency', { currency });
    }

    queryBuilder
      .select('SUM(transaction.affected_amount)', 'balance')
      .addSelect('transaction.currency', 'currency')
      .groupBy('transaction.currency');

    if (currency === 'ALL') return queryBuilder.getRawMany();
    else return queryBuilder.getRawOne();
  }
}
