import { Injectable } from '@nestjs/common';
import { CountryRepository as CommonRepository } from '@app/country/country.repository';

@Injectable()
export class CountryRepository extends CommonRepository {}
