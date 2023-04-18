import { Module } from '@nestjs/common';
import { CountryModule } from '@api/country/country.module';
import { AdminCountryController } from './country.controller';

@Module({
  imports: [CountryModule],
  controllers: [AdminCountryController],
})
export class AdminCountryModule {}
