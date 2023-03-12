import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { Country } from './country.entity';
import { CountryService } from './country.service';

@Controller()
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  // @ApiOperation({ description: `Get available country list` })
  // @UseGuards(JwtAuthGuard)
  // @Get()
  // async getAllCountries(): Promise<Country[]> {
  //   return this.countryService.findAll();
  // }
}
