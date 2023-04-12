import { Module } from '@nestjs/common';
import { CountryActivationService } from './country-activation.service';

@Module({
  providers: [CountryActivationService],
})
export class CountryActivationModule {}
