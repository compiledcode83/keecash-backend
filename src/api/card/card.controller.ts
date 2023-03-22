import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { CardService } from './card.service';
import { GetDepositFeeDto } from './dto/get-deposit-fee.dto';
import { DepositPaymentLinkDto } from './dto/deposit-payment-link.dto';
import { CryptoCurrencyEnum, FiatCurrencyEnum } from '../crypto-tx/crypto-tx.types';
import { WithdrawalApplyDto } from './dto/withdrawal-apply.dto';
import { GetDashboardItemsResponseDto } from './dto/get-dashboard-items-response.dto';
import { GetCardsResponseDto } from './dto/get-cards-response.dto';
import { GetWithdrawalFeeDto } from './dto/get-withdrawal-fee.dto';

@Controller()
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @ApiOperation({ description: 'Get dashboard items' })
  @ApiTags('Dashboard')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('get-dashboard-items')
  async getDashboardItems(@Req() req, @Query() query): Promise<GetDashboardItemsResponseDto> {
    const wallets = await this.cardService.getCardDetailsByUserId(req.user.id);

    return {
      isSuccess: true,
      wallets,
      recommended: FiatCurrencyEnum.EUR,
    };
  }

  @ApiOperation({ description: 'Get my cards' })
  @ApiTags('Card Management')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('get-my-cards')
  async getCards(@Req() req): Promise<GetCardsResponseDto> {
    const cards = await this.cardService.getCardListByUserId(req.user.id);

    return {
      isSuccess: true,
      myCards: cards,
    };
  }

  @ApiOperation({ description: 'Block all my cards' })
  @ApiTags('Card Management')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('card/block/my-card')
  async blockMyCard(@Req() req) {
    await this.cardService.setLockByUserId(req.user.id, true);

    return { isSuccess: true };
  }

  @ApiOperation({ description: 'Unlock all my cards' })
  @ApiTags('Card Management')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('card/unlock/my-card')
  async unlockMyCard(@Req() req) {
    await this.cardService.setLockByUserId(req.user.id, false);

    return { isSuccess: true };
  }

  @ApiOperation({ description: 'Unlock all my cards' })
  @ApiTags('Card Management')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('card/remove/my-card')
  async removeMyCard(@Req() req) {
    await this.cardService.removeByUserId(req.user.id);

    return { isSuccess: true };
  }

  @ApiOperation({ description: 'Get deposit settings' })
  @ApiTags('Deposit')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/deposit/settings')
  async getDepositSettings(@Req() req) {
    return this.cardService.getDepositSettings(req.user.id);
  }

  @ApiOperation({ description: 'Post deposit fees' })
  @ApiTags('Deposit')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/deposit/fees')
  async depositFees(@Body() body: GetDepositFeeDto) {
    return this.cardService.getDepositFee(body);
  }

  @ApiOperation({ description: 'Post deposit payment link' })
  @ApiTags('Deposit')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/deposit/payment-link')
  async depositPaymentLink(@Body() body: DepositPaymentLinkDto) {
    return {
      link: '',
    };
  }

  @ApiOperation({ description: 'Get deposit settings' })
  @ApiTags('Withdrawal')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/withdrawal/settings')
  async withdrawalSettings(@Req() req) {
    return this.cardService.getWithdrawalSettings(req.user.id);
  }

  @ApiOperation({ description: 'Get withdrawal beneficiaries' })
  @ApiTags('Withdrawal')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/withdrawal/beneficiaries/:wallet')
  async getBeneficiaryWallets(@Param('wallet') wallet) {
    return this.cardService.getBeneficiaryWallets(wallet);
  }

  @ApiOperation({ description: 'Post withdrawal fees' })
  @ApiTags('Withdrawal')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/withdrawal/fees')
  async withdrawalFees(@Body() body: GetWithdrawalFeeDto) {
    return this.cardService.getWithdrawalFee(body);
  }

  @ApiOperation({ description: 'Post withdrawal fees' })
  @ApiTags('Withdrawal')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/withdrawal/apply')
  async applyWithdrawal(@Body() body: WithdrawalApplyDto): Promise<void> {
    return;
  }
}
