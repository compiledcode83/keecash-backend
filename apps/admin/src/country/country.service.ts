import { Injectable } from '@nestjs/common';
import { CountryRepository } from './country.repository';
import { UpdateCountryDto } from '../admin/dto/update-country.dto';

@Injectable()
export class CountryService {
  constructor(private readonly countryRepository: CountryRepository) {}

  async updateCountry(body: UpdateCountryDto) {
    try {
      await this.countryRepository.update(body.id, body);

      return this.countryRepository.findOne({ where: { id: body.id } });
    } catch (error) {
      throw error;
    }
  }
}
