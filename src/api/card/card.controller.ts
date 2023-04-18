import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { CardService } from './card.service';
import { FiatCurrencyEnum } from '@api/transaction/transaction.types';
import { GetDashboardItemsResponseDto } from './dto/get-dashboard-items-response.dto';
import { GetCardsResponseDto } from './dto/get-cards-response.dto';
import { GetCreateCardTotalFeeDto } from './dto/get-create-card-total-fee.dto';
import { GetCardHistoryFilterDto } from './dto/get-card-history-filter.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { BridgecardWebhookResponseDto } from './dto/bridgecard-webhook-response.dto';
import { GetCreateCardSettingsDto } from './dto/get-create-card-settings.dto';
import { GetCardTopupSettingDto } from './dto/get-card-topup-setting.dto';
import { TripleADepositNotifyDto } from '@api/triple-a/dto/triple-a-deposit-notify.dto';
import { TripleAWithdrawalNotifyDto } from '@api/triple-a/dto/triple-a-withdrawal-notify.dto';

@Controller()
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @ApiOperation({ description: 'Get dashboard items' })
  @ApiTags('Dashboard')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('get-dashboard-items')
  async getDashboardItems(@Req() req): Promise<GetDashboardItemsResponseDto> {
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
  @ApiParam({ name: 'card_id', required: true, description: 'Bridgecard ID' })
  @ApiTags('Card Management')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('card/block/:card_id')
  async blockCard(@Req() req, @Param('card_id') cardId: string) {
    await this.cardService.blockCard(req.user.id, cardId);

    return { isSuccess: true };
  }

  @ApiOperation({ description: 'Unlock my cards' })
  @ApiParam({ name: 'card_id', required: true, description: 'Bridgecard ID' })
  @ApiTags('Card Management')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('card/unlock/my-card')
  async unlockCard(@Req() req, @Param('card_id') cardId: string) {
    await this.cardService.unlockCard(req.user.id, cardId);

    return { isSuccess: true };
  }

  @ApiOperation({ description: 'Remove all my cards' })
  @ApiParam({ name: 'card_id', required: true, description: 'Bridgecard ID' })
  @ApiTags('Card Management')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('card/remove/my-card')
  async removeMyCard(@Req() req, @Param('card_id') cardId: string) {
    await this.cardService.delete({ userId: req.user.id, bridgecardId: cardId });

    return { isSuccess: true };
  }

  // -------------- HISTORY -------------------

  @ApiOperation({ description: 'Get history of 30 days' })
  @ApiTags('Transaction History')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/history/get-init-history')
  async getInitHistory(@Req() req) {
    return this.cardService.getInitHistory(req.user.id);
  }

  @ApiOperation({ description: '' })
  @ApiParam({ name: 'keecash_wallet_currency', required: true, description: 'Currency of wallet' })
  @ApiTags('Transaction History')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/keecash-wallet/:keecash_wallet_currency/transactions')
  async getKeecashWalletTransactions(
    @Req() req,
    @Param('keecash_wallet_currency') currency: FiatCurrencyEnum,
  ) {
    return this.cardService.getKeecashWalletTransactions(req.user.id, currency);
  }

  @ApiOperation({ description: '' })
  @ApiParam({ name: 'keecash_wallet_currency', required: true, description: 'Currency of wallet' })
  @ApiParam({ name: 'reference', required: true, description: 'Reference' })
  @ApiTags('Transaction History')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/keecash-wallet/:keecash_wallet_currency/transactions/:reference/invoice')
  async getKeecashWalletTransactionInvoice(
    @Req() req,
    @Param('keecash_wallet_currency') currency: FiatCurrencyEnum,
  ) {
    const result = {
      link: '',
    };

    return result;
  }

  @ApiOperation({ description: 'Get card transaction invoices' })
  @ApiParam({ name: 'card_name', required: true, description: 'Card name' })
  @ApiParam({ name: 'reference', required: true, description: 'Reference' })
  @ApiTags('Transaction History')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/card/:card_name/transactions/:reference/invoice')
  async getCardInvoices(@Param() param) {
    const result = {
      link: '',
    };

    return result;
  }

  @ApiOperation({ description: 'Get card transactions' })
  @ApiParam({ name: 'card_name', required: true, description: 'Card name' })
  @ApiTags('Transaction History')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/card/:card_name/transactions/')
  async getCardTransactions(
    @Req() req,
    @Param('card_name') card_name: string,
    @Body() body: GetCardHistoryFilterDto,
  ) {
    const result = [
      {
        currency: 'EUR',
        date: '2023-02-01T14:36:27.106Z',
        from: 'Cameleon', // KEECASH_WALLET_EUR|BTC|ETH|...|Cameleon|Business  exemple BTC,
        to: 'NetFlix irland FRX2453', // merchant_name|KEECASH_WALLET_EUR,
        merchant_logo:
          'https://icones.pro/wp-content/uploads/2021/04/icone-netflix-symbole-logo-original.png', // a store link of the logo for NetFlix for example , or keecash logo directly ...,
        amount: '20.0',
        amount_fx: '19.55',
        currency_fx: 'EUR',
        fix_fees: '0.99',
        percent_fees: '1.0',
        fees_applied: '1.71',
        cashback_fix_fee: '0.0',
        cashback_percent_fee: '0.0',
        cashback_fees_applied: '0.0',
        type: 'DEBIT', // DEBIT|CREDIT,
        status: 'PERFORMED', // PERFORMED|IN_PROGRESS|REFUSED|REFUND,
        reference: 'KCXXXXX',
        exchange_rate: '15000.0',
        reason: '',
        beneficiary_name: '',
        beneficiary_url_avatar: '',
        blockchain_txid_link: '',
        metadata: { a: 'b' },
      },
      {
        currency: 'EUR',
        date: '2023-02-01T14:36:27.106Z',
        from: 'Cameleon', // KEECASH_WALLET_EUR|BTC|ETH|...|Cameleon|Business  exemple BTC,
        to: 'Google En plus', // merchant_name|KEECASH_WALLET_EUR,
        merchant_logo:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/768px-Google_%22G%22_Logo.svg.png', // a store link of the logo for NetFlix for example , or keecash logo directly ...,
        amount: '100.0',
        amount_fx: '19.55',
        currency_fx: 'EUR',
        fix_fees: '0.99',
        percent_fees: '1.0',
        fees_applied: '1.71',
        cashback_fix_fee: '0.0',
        cashback_percent_fee: '0.0',
        cashback_fees_applied: '0.0',
        type: 'DEBIT', // DEBIT|CREDIT,
        status: 'PERFORMED', // PERFORMED|IN_PROGRESS|REFUSED|REFUND,
        reference: 'KCXXXXX',
        exchange_rate: '15000.0',
        reason: '',
        beneficiary_name: '',
        beneficiary_url_avatar: '',
        blockchain_txid_link: '',
        metadata: { a: 'b' },
      },
    ];

    return result;
  }

  // -------------- CREATE CARD -------------------

  @ApiOperation({ description: 'Get create card settings' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiTags('Create Card')
  @Get('create-card/get-settings')
  async getCreateCardSettings(@Req() req, @Query() query: GetCreateCardSettingsDto) {
    return this.cardService.getCreateCardSettings(req.user.id, query);
  }

  @ApiOperation({ description: 'Get fees while creating card' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiTags('Create Card')
  @Post('create-card/get-fees-applied-total-to-pay')
  async getFeesAppliedTotalToPay(@Req() req, @Body() body: GetCreateCardTotalFeeDto) {
    return this.cardService.getFeesAppliedTotalToPay(req.user.id, body);
  }

  @ApiOperation({ description: 'Create card' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiTags('Create Card')
  @Post('create-card/apply')
  async applyCreateCard(@Req() req, @Body() body: CreateCardDto) {
    return this.cardService.createBridgecard(req.user.id, body);
  }

  // -------------- CARD TOPUP -------------------

  @Post('card/top-up/settings')
  async getCardTopupSettings(@Req() req, @Body() body: GetCardTopupSettingDto) {
    return this.cardService.getCardTopupSettings(req.user.countryId, body);
  }

  // -------------- BRIDGECARD WEBHOOK -------------------

  @Post('bridgedard/webhook')
  async handleWebhookEvent(@Body() body: BridgecardWebhookResponseDto) {
    const { event, data } = body;

    await this.cardService.handleBridgecardWebhookEvent(event, data);
  }

  // -------------- TRIPLE-A WEBHOOK -------------------

  @Post('triple/payment-notifiy-deposit')
  async paymentNotifyDeposit(@Body() body: TripleADepositNotifyDto) {
    await this.cardService.handleDepositNotification(body);
  }

  @Post('triple/payment-notifiy-withdraw')
  async paymentNotifyWithdraw(@Body() body: TripleAWithdrawalNotifyDto) {
    await this.cardService.handleWithdrawalNotification(body);
  }
}
