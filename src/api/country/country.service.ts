import { Injectable } from '@nestjs/common';
import { UpdateCountryDto } from '@admin/admin/dto/update-country.dto';
import { Country } from './country.entity';
import { CountryRepository } from './country.repository';

@Injectable()
export class CountryService {
  constructor(private readonly countryRepository: CountryRepository) {}

  async findOne(param: Partial<Country>): Promise<Country> {
    return this.countryRepository.findOneBy(param);
  }

  async getNameList(): Promise<any> {
    return this.countryRepository.getNameList();
  }

  async findOneWithActivationAndFee(
    name: string,
    withActivation = true,
    withFee = true,
  ): Promise<Country> {
    return this.countryRepository.findOneWithActivationAndFee(name, withActivation, withFee);
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
