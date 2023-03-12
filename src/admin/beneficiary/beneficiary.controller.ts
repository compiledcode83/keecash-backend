import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BeneficiaryService } from '@src/api/beneficiary/beneficiary.service';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';

@Controller()
@ApiTags('Get beneficiaries')
export class AdminBeneficiaryController {
  constructor(private readonly beneficiaryService: BeneficiaryService) {}

  @ApiOperation({ description: `Get beneficiary users and wallets` })
  @UseGuards(JwtAdminAuthGuard)
  @Get()
  async getBeneficiaries(@Query('userId') userId: number) {
    return this.beneficiaryService.findAllByUserId(userId, true);
  }
}
