import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BridgecardService } from '@app/bridgecard';
import {
  ApiResponseHelper,
  FiatCurrencyEnum,
  ParamToQueryInterceptor,
  RequestToQueryInterceptor,
} from '@app/common';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { CardService } from '@api/card/card.service';
import { KeecashService } from './keecash.service';
import { GetCardHistoryFilterDto } from './dto/get-card-history-filter.dto';
import { GetWalletTransactionsQueryDto } from './dto/get-wallet-transactions.query.dto';

@ApiTags('Transaction History')
@ApiResponse(ApiResponseHelper.unauthorized())
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('history')
export class HistoryController {
  constructor(
    private readonly keecashService: KeecashService,
    private readonly bridgecardService: BridgecardService,
    private readonly cardService: CardService,
  ) {}

  @ApiOperation({ description: 'Get Keecash wallet transactions by currency' })
  @ApiParam({ name: 'currency', required: true, description: 'Currency of wallet' })
  @UseInterceptors(
    ClassSerializerInterceptor,
    new RequestToQueryInterceptor('user', 'user'),
    new ParamToQueryInterceptor('currency', 'currency'),
  )
  @Get('wallet/:currency')
  async getWalletTransactions(@Query() query: GetWalletTransactionsQueryDto) {
    return this.keecashService.getWalletTransactions(query.user.uuid, query.currency, query);
  }

  @ApiOperation({ description: '' })
  @ApiParam({ name: 'currency', required: true, description: 'Currency of wallet' })
  @ApiParam({ name: 'reference', required: true, description: 'Reference' })
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
  @Get('card/:card_id/transactions/:reference/invoice')
  async getCardInvoice(@Param() param) {
    const result = {
      link: '',
    };

    return result;
  }

  @ApiOperation({ description: 'Get card transactions' })
  @ApiParam({ name: 'card_id', required: true, description: 'Card ID' })
  @UseInterceptors(
    ClassSerializerInterceptor,
    new RequestToQueryInterceptor('user', 'user'),
    new ParamToQueryInterceptor('card_id', 'cardId'),
  )
  @Get('card/:card_id')
  async getCardTransactions(@Query() query: GetCardHistoryFilterDto) {
    const card = await this.cardService.findOne({ bridgecardId: query.cardId });

    if (!card) {
      throw new NotFoundException(`Cannot find the card: ${query.cardId}`);
    }

    if (card.user.uuid !== query.user.uuid) {
      throw new UnauthorizedException(`Request sender is not the owner of card: ${query.cardId}`);
    }

    const transactions = await this.bridgecardService.getCardTransactions(query.cardId);

    return transactions;
  }
}
