import { Body, Controller, Get, NotFoundException, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CountryService } from '@api/country/country.service';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { UpdateCountryDto } from '../admin/dto/update-country.dto';
import { Country } from '@api/country/country.entity';

@Controller()
@ApiTags('Manage countries')
export class AdminCountryController {
  constructor(private readonly countryService: CountryService) {}

  @ApiOperation({ description: `Get available country list` })
  @ApiBearerAuth()
  @UseGuards(JwtAdminAuthGuard)
  @Get('list')
  async getNames(): Promise<string[]> {
    return this.countryService.getNameList();
  }

  // @ApiOperation({ description: `Get a country's activation and fee info` })
  // @ApiBearerAuth()
  // @UseGuards(JwtAdminAuthGuard)
  // @Get()
  // async findOneByName(@Query('name') name: string): Promise<Country> {
  //   const country = await this.countryService.findOne({ name });

  //   if (!country.activation || !country.fee) {
  //     throw new NotFoundException('Requested country has missing activation or fee data');
  //   }

  //   return country;
  // }

  @ApiOperation({ description: 'Update country setting' })
  @ApiBearerAuth()
  @UseGuards(JwtAdminAuthGuard)
  @Patch()
  async updateCountry(@Body() body: UpdateCountryDto) {
    return this.countryService.updateCountry(body);
  }
}
