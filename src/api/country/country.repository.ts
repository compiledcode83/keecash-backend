import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Country } from './country.entity';

@Injectable()
export class CountryRepository extends Repository<Country> {
  constructor(private readonly dataSource: DataSource) {
    super(Country, dataSource.manager);
  }

  async getNameList(): Promise<string[]> {
    const countries = await this.createQueryBuilder('country').select('name').getRawMany();

    const names = countries.map((country) => country.name);

    return names;
  }

  async findOneWithActivationAndFee(name, withActivation, withFee): Promise<Country> {
    const queryBuilder = this.createQueryBuilder('country');

    if (withActivation) {
      queryBuilder.leftJoinAndSelect('country.activation', 'activation');
    }

    if (withFee) {
      queryBuilder.leftJoinAndSelect('country.fee', 'fee');
    }

    const country = await queryBuilder.where({ name }).getOne();

    return country;
  }
}
