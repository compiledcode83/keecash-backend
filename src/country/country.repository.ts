import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Country } from './country.entity';

@Injectable()
export class CountryRepository extends Repository<Country> {
  constructor(private readonly dataSource: DataSource) {
    super(Country, dataSource.manager);
  }

  async findAll(withActivation, withFee) {
    const queryBuilder = this.createQueryBuilder('country');

    if (withActivation) {
      queryBuilder.leftJoinAndSelect('country.activation', 'activation');
    }

    if (withFee) {
      queryBuilder.leftJoinAndSelect('country.fee', 'fee');
    }

    const countries = queryBuilder.limit().getMany();

    return countries;
  }
}
