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

  async getCountryList(): Promise<any[]> {
    const countries: {
      name: string;
      country_code: string;
      phone_code: string;
      is_active: boolean;
    }[] = await this.createQueryBuilder('country')
      .innerJoin('country.activation', 'activation')
      .select(['name', 'country_code', 'phone_code', 'activation.isActive as is_active'])
      .getRawMany();

    const activeCountryOnly = countries.filter((country) => country.is_active === true);

    return activeCountryOnly;
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
