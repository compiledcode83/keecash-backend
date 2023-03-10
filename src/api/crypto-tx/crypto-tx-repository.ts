import { Injectable } from '@nestjs/common';
import { DataSource, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { buildPaginator } from 'typeorm-cursor-pagination';
import { CryptoTx } from './crypto-tx.entity';
import { CryptoTransactionFilterDto } from './dto/crypto-transaction-filter.dto';

@Injectable()
export class CryptoTxRepository extends Repository<CryptoTx> {
  constructor(private readonly dataSource: DataSource) {
    super(CryptoTx, dataSource.manager);
  }

  async findAllPaginated(searchParams: CryptoTransactionFilterDto) {
    const queryBuilder = this.createQueryBuilder('crypto_tx');

    if ('currencyName' in searchParams) {
      queryBuilder.andWhere({ currencyName: searchParams.currencyName });
    }
    if ('type' in searchParams) {
      queryBuilder.andWhere({ type: searchParams.type });
    }
    if ('fromDate' in searchParams) {
      queryBuilder.andWhere({
        createdAt: MoreThanOrEqual(searchParams.fromDate),
      });
    }
    if ('toDate' in searchParams) {
      queryBuilder.andWhere({
        createdAt: LessThanOrEqual(searchParams.toDate),
      });
    }
    if ('userId' in searchParams) {
      queryBuilder.andWhere({ userSenderId: searchParams.userId });
      queryBuilder.orWhere({ userReceiverId: searchParams.userId });
    }

    const paginator = buildPaginator({
      entity: CryptoTx,
      alias: 'crypto_tx',
      paginationKeys: ['id', searchParams.orderParam],
      query: {
        limit: searchParams.limit,
        order: searchParams.orderType,
        afterCursor: searchParams.afterCursor,
        beforeCursor: searchParams.beforeCursor,
      },
    });

    return paginator.paginate(queryBuilder);
  }
}
