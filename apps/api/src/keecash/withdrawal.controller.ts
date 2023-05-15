import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { KeecashService } from './keecash.service';
import { GetWithdrawalFeeDto } from './dto/get-withdrawal-fee.dto';
import { WithdrawalApplyDto } from './dto/withdrawal-apply.dto';

@ApiTags('Withdrawal')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('withdrawal')
export class WithdrawalController {
  constructor(private readonly keecashService: KeecashService) {}

  @ApiOperation({ description: 'Post withdrawal fees' })
  @Get('fees')
  async withdrawalFees(@Req() req, @Query() query: GetWithdrawalFeeDto) {
    return this.keecashService.getWithdrawalFee(req.user.countryId, query);
  }

  @ApiOperation({ description: 'Apply withdrawal' })
  @Post('apply')
  async applyWithdrawal(@Req() req, @Body() body: WithdrawalApplyDto): Promise<any> {
    return this.keecashService.applyWithdrawal(req.user, body);
  }
}
