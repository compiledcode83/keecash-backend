import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private readonly dataSource: DataSource) {}

  async healthCheck(): Promise<void> {
    await Promise.all([this.dataSource.query('SELECT NOW()')]);
  }
}
