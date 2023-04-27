import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CardService } from './card.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { FiatCurrencyEnum } from '@api/transaction/transaction.types';
import { GetCardHistoryFilterDto } from './dto/get-card-history-filter.dto';
import { GetWalletTransactionsDto } from './dto/get-wallet-transactions.dto';
import { BridgecardService } from '@api/bridgecard/bridgecard.service';

@Controller('history')
export class HistoryController {
  constructor(
    private readonly cardService: CardService,
    private readonly bridgecardService: BridgecardService,
  ) {}

  @ApiOperation({ description: 'Get Keecash wallet transactions by currency' })
  @ApiParam({ name: 'currency', required: true, description: 'Currency of wallet' })
  @ApiTags('Transaction History')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('wallet/:currency')
  async getWalletTransactions(
    @Req() req,
    @Param('currency') currency: FiatCurrencyEnum,
    @Query() query: GetWalletTransactionsDto,
  ) {
    return this.cardService.getWalletTransactions(req.user.id, currency, query);
  }

  @ApiOperation({ description: '' })
  @ApiParam({ name: 'currency', required: true, description: 'Currency of wallet' })
  @ApiParam({ name: 'reference', required: true, description: 'Reference' })
  @ApiTags('Transaction History')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('wallet/:currency/transactions/:reference/invoice')
  async getWalletTransactionInvoice(
    @Req() req,
    @Param('keecash_wallet_currency') currency: FiatCurrencyEnum,
  ) {
    const result = {
      link: '',
    };

    return result;
  }

  @ApiOperation({ description: 'Get card transaction invoices' })
  @ApiParam({ name: 'card_id', required: true, description: 'Card ID' })
  @ApiParam({ name: 'reference', required: true, description: 'Reference' })
  @ApiTags('Transaction History')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('card/:card_id/transactions/:reference/invoice')
  async getCardInvoice(@Param() param) {
    const result = {
      link: '',
    };

    return result;
  }

  @ApiOperation({ description: 'Get card transactions' })
  @ApiParam({ name: 'card_id', required: true, description: 'Card ID' })
  @ApiTags('Transaction History')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('card/:card_id')
  async getCardTransactions(
    @Req() req,
    @Param('card_id') cardId: string,
    @Query() query: GetCardHistoryFilterDto,
  ) {
    const card = await this.cardService.findOne({ bridgecardId: cardId });

    if (!card) {
      throw new NotFoundException(`Cannot find the card: ${cardId}`);
    }

    if (card.userId !== req.user.id) {
      throw new UnauthorizedException(`Request sender is not the owner of card: ${cardId}`);
    }

    const transactions = await this.bridgecardService.getCardTransactions(cardId);

    return transactions;
  }
}
