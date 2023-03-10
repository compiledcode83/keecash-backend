import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CardHistory } from './card-history.entity';

@Injectable()
export class CardHistoryRepository extends Repository<CardHistory> {
  constructor(private readonly dataSource: DataSource) {
    super(CardHistory, dataSource.manager);
  }
}
