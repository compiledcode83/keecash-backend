import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Shareholder } from './shareholder.entity';

@Injectable()
export class ShareholderRepository extends Repository<Shareholder> {
  constructor(private readonly dataSource: DataSource) {
    super(Shareholder, dataSource.manager);
  }
}
