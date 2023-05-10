import { Injectable } from '@nestjs/common';
import { Country } from '@app/country';
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
}
