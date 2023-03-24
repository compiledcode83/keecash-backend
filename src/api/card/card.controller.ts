import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { CardService } from './card.service';
import { GetDepositFeeDto } from './dto/get-deposit-fee.dto';
import { DepositPaymentLinkDto } from './dto/deposit-payment-link.dto';
import { FiatCurrencyEnum } from '../crypto-tx/crypto-tx.types';
import { WithdrawalApplyDto } from './dto/withdrawal-apply.dto';
import { GetDashboardItemsResponseDto } from './dto/get-dashboard-items-response.dto';
import { GetCardsResponseDto } from './dto/get-cards-response.dto';
import { GetWithdrawalFeeDto } from './dto/get-withdrawal-fee.dto';
import { GetTransferFeeDto } from './dto/get-transfer-fee.dto';
import { TransferApplyDto } from './dto/transfer-apply.dto';
import { ManageCardDto } from './dto/manage-card.dto';

@Controller()
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @ApiOperation({ description: 'Get dashboard items' })
  @ApiTags('Dashboard')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('get-dashboard-items')
  async getDashboardItems(@Req() req, @Query() query): Promise<GetDashboardItemsResponseDto> {
    const wallets = await this.cardService.getDashboardItemsByUserId(req.user.id);

    return {
      isSuccess: true,
      wallets,
      recommended: FiatCurrencyEnum.EUR,
    };
  }

  // -------------- MANAGE CARD -------------------

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

  @ApiOperation({ description: 'Block my cards' })
  @ApiTags('Card Management')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('card/block/my-card')
  async blockMyCard(@Req() req, @Body() body: ManageCardDto) {
    await this.cardService.setLock(req.user.id, body.cardId, true);

    return { isSuccess: true };
  }

  @ApiOperation({ description: 'Unlock my cards' })
  @ApiTags('Card Management')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('card/unlock/my-card')
  async unlockMyCard(@Req() req, @Body() body: ManageCardDto) {
    await this.cardService.setLock(req.user.id, body.cardId, false);

    return { isSuccess: true };
  }

  @ApiOperation({ description: 'Remove all my cards' })
  @ApiTags('Card Management')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('card/remove/my-card')
  async removeMyCard(@Req() req, @Body() body: ManageCardDto) {
    await this.cardService.removeOne(req.user.id, body.cardId);

    return { isSuccess: true };
  }

  // -------------- DEPOSIT -------------------

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

  // -------------- WITHDRAWAL -------------------

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

  @ApiOperation({ description: 'Apply withdrawal' })
  @ApiTags('Withdrawal')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/withdrawal/apply')
  async applyWithdrawal(@Body() body: WithdrawalApplyDto): Promise<string> {
    return 'ok';
  }

  // -------------- TRANSFER -------------------

  @ApiOperation({ description: 'Get transfer settings' })
  @ApiTags('Transfer')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/transfer/settings')
  async transferSettings(@Req() req) {
    return this.cardService.getTransferSettings(req.user.id, req.user.referralId);
  }

  @ApiOperation({ description: 'Get transfer fees' })
  @ApiTags('Transfer')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/transfer/fees')
  async transferFees(@Body() body: GetTransferFeeDto) {
    return this.cardService.getTransferFee(body);
  }

  @ApiOperation({ description: 'Apply transfer' })
  @ApiTags('Transfer')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/transfer/apply')
  async applyTransfer(@Body() body: TransferApplyDto): Promise<string> {
    return 'ok';
  }
}
