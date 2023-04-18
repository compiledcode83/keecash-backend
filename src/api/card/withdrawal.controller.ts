import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CardService } from './card.service';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { GetWithdrawalFeeDto } from './dto/get-withdrawal-fee.dto';
import { WithdrawalApplyDto } from './dto/withdrawal-apply.dto';
import { CryptoCurrencyEnum } from '@api/transaction/transaction.types';

@Controller('withdrawal')
export class WithdrawalController {
  constructor(private readonly cardService: CardService) {}

  @ApiOperation({ description: 'Get deposit settings' })
  @ApiTags('Withdrawal')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('settings')
  async withdrawalSettings(@Req() req) {
    return this.cardService.getWithdrawalSettings(req.user.id);
  }

  @ApiOperation({ description: 'Get withdrawal beneficiaries' })
  @ApiTags('Withdrawal')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('beneficiaries/:wallet')
  async getBeneficiaryWallets(@Req() req, @Param('wallet') wallet: CryptoCurrencyEnum) {
    return this.cardService.getBeneficiaryWallets(req.user.id, wallet);
  }

  @ApiOperation({ description: 'Post withdrawal fees' })
  @ApiTags('Withdrawal')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('fees')
  async withdrawalFees(@Req() req, @Body() body: GetWithdrawalFeeDto) {
    return this.cardService.getWithdrawalFee(req.user.countryId, body);
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
