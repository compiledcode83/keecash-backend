import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { CardService } from './card.service';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @ApiOperation({ description: `Get my all cards` })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAllPaginated(@Request() req) {
    return;
  }

  @Get(':/card_name/transactions/')
  async getTransactions() {
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
}
