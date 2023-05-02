import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { SumsubService } from './sumsub.service';

@Controller('sumsub')
export class SumsubController {
  constructor(private readonly sumsubService: SumsubService) {}

  @ApiOperation({ description: `Get sumsub api access token for development` })
  @Get('dev-sumsub-access-token')
  async getSumsubAccessToken() {
    const token = await this.sumsubService.createSumsubAccessToken('JamesBond007');

    return {
      token,
      userId: 'JamesBond007',
    };
  }
}
