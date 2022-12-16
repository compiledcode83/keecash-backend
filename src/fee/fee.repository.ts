import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Fee } from './fee.entity';

@Injectable()
export class FeeRepository extends Repository<Fee> {
  constructor(private readonly dataSource: DataSource) {
    super(Fee, dataSource.manager);
  }
}
