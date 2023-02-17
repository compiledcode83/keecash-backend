import { Module } from '@nestjs/common';
import { CountryRepository } from './country.repository';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';

@Module({
  providers: [CountryService, CountryRepository],
  exports: [CountryService],
  controllers: [CountryController],
})
export class CountryModule {}
