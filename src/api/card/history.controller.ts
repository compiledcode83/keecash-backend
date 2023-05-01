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
import { GetWalletTransactionsQueryDto } from './dto/get-wallet-transactions.query.dto';
import { BridgecardService } from '@api/bridgecard/bridgecard.service';
import { GetWalletTransactionsParamDto } from './dto/get-wallet-transactions.param.dto';
import { ManageCardDto } from './dto/manage-card.dto';

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
    @Param() param: GetWalletTransactionsParamDto,
    @Query() query: GetWalletTransactionsQueryDto,
  ) {
    return this.cardService.getWalletTransactions(req.user.id, param.currency, query);
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
    @Param() param: ManageCardDto,
    @Query() query: GetCardHistoryFilterDto,
  ) {
    const card = await this.cardService.findOne({ bridgecardId: param.card_id });

    if (!card) {
      throw new NotFoundException(`Cannot find the card: ${param.card_id}`);
    }

    if (card.userId !== req.user.id) {
      throw new UnauthorizedException(`Request sender is not the owner of card: ${param.card_id}`);
    }

    const transactions = await this.bridgecardService.getCardTransactions(param.card_id);

    return transactions;
  }
}
