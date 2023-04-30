import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CardService } from './card.service';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { GetWithdrawalFeeDto } from './dto/get-withdrawal-fee.dto';
import { WithdrawalApplyDto } from './dto/withdrawal-apply.dto';

@Controller('withdrawal')
export class WithdrawalController {
  constructor(private readonly cardService: CardService) {}

  @ApiOperation({ description: 'Post withdrawal fees' })
  @ApiTags('Withdrawal')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('fees')
  async withdrawalFees(@Req() req, @Query() query: GetWithdrawalFeeDto) {
    return this.cardService.getWithdrawalFee(req.user.countryId, query);
  }

  @ApiOperation({ description: 'Apply withdrawal' })
  @ApiTags('Withdrawal')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('apply')
  async applyWithdrawal(@Req() req, @Body() body: WithdrawalApplyDto): Promise<any> {
    return this.cardService.applyWithdrawal(req.user, body);
  }
}
