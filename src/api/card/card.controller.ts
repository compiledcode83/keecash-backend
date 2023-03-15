import { Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { CardService } from './card.service';
import { query } from 'express';

@Controller()
@ApiTags('Get cards data')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @ApiOperation({ description: `Get my all cards` })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAllPaginated(@Request() req) {
    return;
  }

  @ApiOperation({ description: 'Get dashboard items' })
  @ApiBearerAuth()
  @Get('get-dashboard-items')
  async getDashboardItems(@Query() query) {
    const transactions = [
      {
        amount: '200',
        currency: '$',
        date: '2022-11-12 07:30',
        from: 'From back',
        to: 'Front',
        type: 'income',
      },
      {
        amount: '40',
        currency: '$',
        date: '2022-11-12 07:30',
        from: 'From back',
        to: 'Front',
        type: 'outgoing',
      },
      {
        amount: '150',
        currency: '$',
        date: '2022-11-12 07:30',
        from: 'From back',
        to: 'Front',
        type: 'income',
      },
      {
        amount: '19.57',
        currency: '$',
        date: '2022-11-12 07:30',
        from: 'From back',
        to: 'Front',
        type: 'outgoing',
      },
      {
        amount: '120.5',
        currency: '$',
        date: '2022-11-12 07:30',
        from: 'From back',
        to: 'Front',
        type: 'income',
      },
      {
        amount: '110',
        currency: '$',
        date: '2022-11-12 07:30',
        from: 'From back',
        to: 'Front',
        type: 'outgoing',
      },
      {
        amount: '77',
        currency: '$',
        date: '2022-11-12 07:30',
        from: 'From back',
        to: 'Front',
        type: 'income',
      },
      {
        amount: '65',
        currency: '$',
        date: '2022-11-12 07:30',
        from: 'From back',
        to: 'Front',
        type: 'outgoing',
      },
      {
        amount: '240',
        currency: '$',
        date: '2022-11-12 07:30',
        from: 'From back',
        to: 'Front',
        type: 'income',
      },
      {
        amount: '34',
        currency: '$',
        date: '2022-11-12 07:30',
        from: 'From back',
        to: 'Front',
        type: 'outgoing',
      },
    ];
    const wallets = [
      {
        balance: '1000',
        currency: 'EUR',
        cards: [
          {
            logo: '',
            balance: '450',
            currency: '€',
            cardNumber: '12345 1334',
            name: 'Cameleon',
            date: '03/12',
          },
          {
            logo: '',
            balance: '550',
            currency: '€',
            cardNumber: '12345 1555',
            name: 'test',
            date: '02/12',
          },
        ],
      },
      {
        balance: '1550',
        currency: 'USD',
        cards: [
          {
            logo: '', // !remove
            balance: '1550',
            currency: '$',
            cardNumber: '5123446******1234', // ! changer le fonctionnement 5 visa 4 master
            name: 'Pasquier',
            date: '03/12',
          },
        ],
      },
    ];

    return {
      isSuccess: true,
      wallets,
      recommended: 'EUR',
    };
  }

  @ApiOperation({ description: 'Get card transaction invoices' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/card/:card_name/transactions/:reference/invoice')
  async getInvoices(@Param() params) {
    const result = {
      link: '',
    };

    return result;
  }

  @ApiOperation({ description: 'Get card transactions' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/card/:card_name/transactions/')
  async getTransactions(@Param() params) {
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
