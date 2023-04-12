import { Module } from '@nestjs/common';
import { CountryFeeRepository } from './country-fee.repository';
import { CountryFeeService } from './country-fee.service';

@Module({
  providers: [CountryFeeService, CountryFeeRepository],
  exports: [CountryFeeService],
})
export class CountryFeeModule {}
