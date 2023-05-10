import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryRepository } from './country.repository';

@Module({
  providers: [CountryService, CountryRepository],
  exports: [CountryService],
})
export class CountryModule {}
