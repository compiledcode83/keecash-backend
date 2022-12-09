import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CryptoTx } from './crypto-tx.entity';

@Injectable()
export class CryptoTxRepository extends Repository<CryptoTx> {
  constructor(private readonly dataSource: DataSource) {
    super(CryptoTx, dataSource.manager);
  }
}
