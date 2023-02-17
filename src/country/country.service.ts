import { Injectable } from '@nestjs/common';
import { Country } from './country.entity';
import { CountryRepository } from './country.repository';

@Injectable()
export class CountryService {
  constructor(private readonly countryRepository: CountryRepository) {}

  async findCountryByName(name: string): Promise<Country> {
    const country = await this.countryRepository.findOne({
      where: { name },
    });
    return country;
  }

  async getCountryList(): Promise<Country[]> {
    const countryList = await this.countryRepository
      .createQueryBuilder('country')
      .select(['name', 'country_code', 'phone_code'])
      .getRawMany();

    return countryList;
  }
}
