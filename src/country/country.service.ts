import { Injectable } from '@nestjs/common';
import { UpdateCountryDto } from '@src/admin/dto/update-country.dto';
import { UpdateResult } from 'typeorm';
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

  async findAll(withActivation = true, withFee = true): Promise<Country[]> {
    const countryList = await this.countryRepository.findAll(withActivation, withFee);

    return countryList;
  }

  async updateCountry(body: UpdateCountryDto) {
    try {
      await this.countryRepository.update(body.id, body);

      return this.countryRepository.findOne({ where: { id: body.id } });
    } catch (error) {
      throw error;
    }
  }
}
