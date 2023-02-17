import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Country } from './country.entity';

@Injectable()
export class CountryRepository extends Repository<Country> {
  constructor(private readonly dataSource: DataSource) {
    super(Country, dataSource.manager);
  }
}
