import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/auth/guards/jwt-auth.guard';
import { Country } from './country.entity';
import { CountryService } from './country.service';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @ApiOperation({ description: `Get available country list` })
  @UseGuards(JwtAuthGuard)
  @Get('list')
  async getCountryList(): Promise<Country[]> {
    return this.countryService.getCountryList();
  }
}
