import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { CardService } from './card.service';
import { FiatCurrencyEnum } from '../crypto-tx/crypto-tx.types';
import { GetDashboardItemsResponseDto } from './dto/get-dashboard-items-response.dto';
import { GetCardsResponseDto } from './dto/get-cards-response.dto';
import { ManageCardDto } from './dto/manage-card.dto';
import { GetCreateCardTotalFeeDto } from './dto/get-create-card-total-fee.dto';
import { GetCardHistoryFilterDto } from './dto/get-card-history-filter.dto';

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
  @ApiTags('Transaction History')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/keecash-wallet/:keecash_wallet_currency/transactions')
  @ApiParam({ name: 'keecash_wallet_currency', required: true, description: 'Currency of wallet' })
  async getKeecashWalletTransactions(
    @Req() req,
    @Param('keecash_wallet_currency') currency: FiatCurrencyEnum,
  ) {
    return this.cardService.getKeecashWalletTransactions(req.user.id, currency);
  }

  @ApiOperation({ description: '' })
  @ApiTags('Transaction History')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/keecash-wallet/:keecash_wallet_currency/transactions/:reference/invoice')
  @ApiParam({ name: 'keecash_wallet_currency', required: true, description: 'Currency of wallet' })
  @ApiParam({ name: 'reference', required: true, description: 'Reference' })
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
  @ApiTags('Transaction History')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/card/:card_name/transactions/:reference/invoice')
  @ApiParam({ name: 'card_name', required: true, description: 'Card name' })
  @ApiParam({ name: 'reference', required: true, description: 'Reference' })
  async getCardInvoices(@Param() param) {
    const result = {
      link: '',
    };

    return result;
  }

  @ApiOperation({ description: 'Get card transactions' })
  @ApiTags('Transaction History')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/card/:card_name/transactions/')
  @ApiParam({ name: 'card_name', required: true, description: 'Card name' })
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
  async getCreateCardSettings(@Req() req) {
    return this.cardService.getCreateCardSettings(req.user.id);
  }

  @ApiOperation({ description: 'Get fees while creating card' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiTags('Create Card')
  @Post('create-card/get-fees-applied-total-to-pay')
  async getFeesAppliedTotalToPay(@Body() body: GetCreateCardTotalFeeDto) {
    return this.cardService.getFeesAppliedTotalToPay(body);
  }

  @ApiOperation({ description: 'Create card' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiTags('Create Card')
  @Post('create-card/apply')
  async applyCreateCard(@Req() req, @Body() body) {
    return 'ok';
  }
}
