import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CardHistoryService } from './card-history.service';

@Controller()
@ApiTags('History')
export class CardHistoryController {
  constructor(private readonly cardHistoryService: CardHistoryService) {}

  @ApiOperation({ description: 'Get history of 30 days' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/history/get-init-history')
  async getInitHistory(@Req() req) {
    const result = {
      keecash_wallet_transactions: [
        {
          keecash_wallet_currency: 'EUR',
          filters: {
            must_contains: '',
            amount_min: '1.0',
            amount_max: '100.0',
            from_date: '2023-01-03T15:51:53.678678',
            to_date: '2023-02-02T15:51:53.678678',
            type_list_filter: ['ALL', 'DEPOSIT'], // 'ALL|DEPOSIT|WITHDRAWAL|TRANSFER_SENT|TRANSFER_RECEIVED',
            type_list: [
              'ALL',
              'DEPOSIT',
              'WITHDRAWAL',
              'TRANSFER_SENT',
              'TRANSFER_RECEIVED',
              'CARD_TOPUP',
              'CARD_WITHDRAWAL',
            ],
            via_list_filter: ['ALL', 'BTC'], // 'ALL|BTC|ETH|...|Cameleon|Business'
            via_list: ['ALL', 'KEECASH_WALLET_EUR', 'BTC', 'ETH', 'Business'], // list all type
            range_amount_max: '1000',
          },
          transactions: [
            {
              date: '2023-02-01T14:32:39.904Z',
              currency: 'EUR',
              from: 'BTC', // 'KEECASH_WALLET_EUR|BTC|ETH|...|Cameleon|Business (card name)',
              from_amount: '20.00',
              from_amount_crypto: '0.0001',
              to: 'KEECASH_WALLET_EUR', // 'KEECASH_WALLET_EUR|BTC|ETH|...|Cameleon|Business  exemple BTC',
              to_amount: '20.00',
              to_amount_crypto: '0',
              description: 'Deposit From BTC',
              fix_fees: '0.99',
              percent_fees: '1.0',
              card_price_fees: '0',
              card_brand: '',
              fees_applied: '1.71',
              type: 'DEPOSIT', // 'DEPOSIT|WITHDRAWAL|TRANSFER_SENT|TRANSFER_RECEIVED',
              status: 'PERFORMED', // 'PERFORMED|IN_PROGRESS|REFUSED|REFUND',
              reference: 'KCXXXXX',
              exchange_rate: '15000.0',
              reason: '',
              beneficiary_name: '',
              beneficiary_url_avatar: '',
              blockchain_txid_link: '',
              metadata: { a: 'b' },
            },
            {
              date: '2023-02-01T14:32:39.904Z',
              currency: 'EUR',
              from: 'KEECASH_WALLET_EUR', // 'KEECASH_WALLET_EUR|BTC|ETH|...|Cameleon|Business (card name)',
              from_amount: '10.00',
              from_amount_crypto: '0',
              to: 'ETH', // 'KEECASH_WALLET_EUR|BTC|ETH|...|Cameleon|Business  exemple BTC',
              to_amount: '9.00',
              to_amount_crypto: '0.001',
              description: 'Withdrawal To ETH Wallet',
              fix_fees: '0.99',
              percent_fees: '1.0',
              card_price_fees: '0',
              card_brand: '',
              fees_applied: '1.71',
              type: 'WITHDRAWAL', // 'DEPOSIT|WITHDRAWAL|TRANSFER_SENT|TRANSFER_RECEIVED',
              status: 'PERFORMED', // 'PERFORMED|IN_PROGRESS|REFUSED|REFUND',
              reference: 'KCXXXXX',
              exchange_rate: '1000.0',
              reason: '',
              beneficiary_name: 'My ETH Trust Wallet',
              beneficiary_url_avatar: '',
              blockchain_txid_link:
                'https://etherscan.io/tx/0x575e2d90cbc6659dc12c3a00f4c8365936e2863a3f58e4ea1308cb6214ddb64a',
              metadata: { a: 'b' },
            },
            {
              date: '2023-02-01T14:32:39.904Z',
              currency: 'EUR',
              from: 'KEECASH_WALLET_EUR', // 'KEECASH_WALLET_EUR|BTC|ETH|...|Cameleon|Business (card name)',
              from_amount: '5.00',
              from_amount_crypto: '0',
              to: 'Elon Musk', // 'KEECASH_WALLET_EUR|BTC|ETH|...|Cameleon|Business  exemple BTC',
              to_amount: '9.00',
              to_amount_crypto: '0.0',
              description: 'Transfer to Elon Musk',
              fix_fees: '0.99',
              percent_fees: '1.0',
              card_price_fees: '0',
              card_brand: '',
              fees_applied: '1.71',
              type: 'TRANSFER_SENT', // 'DEPOSIT|WITHDRAWAL|TRANSFER_SENT|TRANSFER_RECEIVED',
              status: 'PERFORMED', // 'PERFORMED|IN_PROGRESS|REFUSED|REFUND',
              reference: 'KCXXXXX',
              exchange_rate: '0',
              reason: 'He need help',
              beneficiary_name: 'Elon Musk',
              beneficiary_url_avatar:
                'https://upload.wikimedia.org/wikipedia/commons/9/93/Elon_Musk_Colorado_2022_%28cropped%29.jpg',
              blockchain_txid_link: '',
              metadata: { a: 'b' },
            },
            {
              date: '2023-02-01T14:32:39.904Z',
              currency: 'EUR',
              from: 'KEECASH_WALLET_EUR', // 'KEECASH_WALLET_EUR|BTC|ETH|...|Cameleon|Business (card name)',
              from_amount: '5.00',
              from_amount_crypto: '0',
              to: 'Serena Williams', // 'KEECASH_WALLET_EUR|BTC|ETH|...|Cameleon|Business  exemple BTC',
              to_amount: '9.00',
              to_amount_crypto: '0.0',
              description: 'Transfer from Serena Williams',
              fix_fees: '0.99',
              percent_fees: '1.0',
              card_price_fees: '0',
              card_brand: '',
              fees_applied: '1.71',
              type: 'TRANSFER_RECEIVED', // 'DEPOSIT|WITHDRAWAL|TRANSFER_SENT|TRANSFER_RECEIVED|CARD_TOPUP|CARD_WITHDRAWAL',
              status: 'PERFORMED', // 'PERFORMED|IN_PROGRESS|REFUSED|REFUND',
              reference: 'KCXXXXX',
              exchange_rate: '0',
              reason: 'I can help you',
              beneficiary_name: 'Serena Williams',
              beneficiary_url_avatar:
                'https://resize-elle.ladmedia.fr/rcrop/1024,1024/img/var/plain_site/storage/images/minceur/news/stars/serena-williams-lance-sa-marque-de-soins-post-sport-4082566/97947482-1-fre-FR/Serena-Williams-lance-sa-marque-de-soins-post-sport.jpg',
              blockchain_txid_link: '',
              metadata: { a: 'b' },
            },
            {
              date: '2023-02-01T14:32:39.904Z',
              currency: 'EUR',
              from: 'KEECASH_WALLET_EUR', // 'KEECASH_WALLET_EUR|BTC|ETH|...|Cameleon|Business (card name)',
              from_amount: '2.00',
              from_amount_crypto: '0',
              to: 'Cameleon', // 'KEECASH_WALLET_EUR|BTC|ETH|...|Cameleon|Business  exemple BTC',
              to_amount: '1.00',
              to_amount_crypto: '0.0',
              description: 'Top up of Cameleon card',
              fix_fees: '0.99',
              percent_fees: '1.0',
              card_price_fees: '0',
              card_brand: 'Mastercard',
              fees_applied: '1.71',
              type: 'CARD_TOPUP', // 'DEPOSIT|WITHDRAWAL|TRANSFER_SENT|TRANSFER_RECEIVED|CARD_TOPUP|CARD_WITHDRAWAL',
              status: 'PERFORMED', // 'PERFORMED|IN_PROGRESS|REFUSED|REFUND',
              reference: 'KCXXXXX',
              exchange_rate: '0',
              reason: '',
              beneficiary_name: '',
              beneficiary_url_avatar: '',
              blockchain_txid_link: '',
              metadata: { a: 'b' },
            },
            {
              date: '2023-02-01T14:32:39.904Z',
              currency: 'EUR',
              from: 'Mariage', // 'KEECASH_WALLET_EUR|BTC|ETH|...|Cameleon|Business (card name)',
              from_amount: '3.00',
              from_amount_crypto: '0',
              to: 'KEECASH_WALLET_EUR', // 'KEECASH_WALLET_EUR|BTC|ETH|...|Cameleon|Business  exemple BTC',
              to_amount: '2.00',
              to_amount_crypto: '0.0',
              description: 'Withdrawal from Mariage card',
              fix_fees: '0.99',
              percent_fees: '1.0',
              card_price_fees: '0',
              card_brand: 'Visa',
              fees_applied: '1.71',
              type: 'CARD_WITHDRAWAL', // 'DEPOSIT|WITHDRAWAL|TRANSFER_SENT|TRANSFER_RECEIVED|CARD_TOPUP|CARD_WITHDRAWAL',
              status: 'PERFORMED', // 'PERFORMED|IN_PROGRESS|REFUSED|REFUND',
              reference: 'KCXXXXX',
              exchange_rate: '0',
              reason: '',
              beneficiary_name: '',
              beneficiary_url_avatar: '',
              blockchain_txid_link: '',
              metadata: { a: 'b' },
            },
          ],
        },
        {
          keecash_wallet_currency: 'USD',
          filters: {
            must_contains: '',
            amount_min: '1.0',
            amount_max: '100.0',
            from_date: '2023-01-03T15:51:53.678678',
            to_date: '2023-02-02T15:51:53.678678',
            type_list_filter: ['ALL'], // ALL|DEPOSIT|WITHDRAWAL|TRANSFER_SENT|TRANSFER_RECEIVED,
            type_list: [
              'ALL',
              'DEPOSIT',
              'WITHDRAWAL',
              'TRANSFER_SENT',
              'TRANSFER_RECEIVED',
              'CARD_TOPUP',
              'CARD_WITHDRAWAL',
            ],
            via_list_filter: ['ALL'], // ALL|KEECASH_WALLET_EUR|BTC|ETH|...|Cameleon|Business (card_name)
            via_list: ['ALL', 'KEECASH_WALLET_USD', 'BTC', 'ETH', 'Cameleon'],
            range_amount_max: '1000',
          },
          transactions: [
            {
              currency: 'USD',
              date: '2023-02-01T14:35:01.660Z',
              from: 'KEECASH_WALLET_USD', // KEECASH_WALLET_EUR|BTC|ETH|...|Cameleon|Business  exemple BTC,
              from_amount: '30.00',
              from_amount_crypto: '0',
              to: 'ETH', // KEECASH_WALLET_EUR|BTC|ETH|...|Cameleon|Business(card_name also),
              to_amount: '29.5',
              to_amount_crypto: '0.025',
              description: 'Withdrawal', // translate
              fix_fees: '0.99',
              percent_fees: '1.0',
              card_price_fees: '10',
              card_brand: '',
              fees_applied: '1.7',
              type: 'WITHDRAWAL', // 'DEPOSIT|WITHDRAWAL|TRANSFER_SENT|TRANSFER_RECEIVED',
              status: 'PERFORMED', // PERFORMED|IN_PROGRESS|REFUSED|REFUND,
              reference: 'KCXXXXX',
              exchange_rate: '15000.0',
              reason: '',
              beneficiary_name: '',
              beneficiary_url_avatar:
                'https://upload.wikimedia.org/wikipedia/commons/9/93/Elon_Musk_Colorado_2022_%28cropped%29.jpg',
              blockchain_txid_link: '',
              metadata: { a: 'b' },
            },
          ],
        },
      ],
      card_transactions: [
        {
          card_name: 'Cameleon',
          card_currency: 'EUR',
          masked_number: '412345******1234',
          filters: {
            must_contains: '',
            amount_min: '1.0',
            amount_max: '100.0',
            from_date: '2023-01-03T15:51:53.678678',
            to_date: '2023-02-02T15:51:53.678678',
            type_list_filter: ['ALL'], // ALL|DEBIT|CREDIT
            type_list: ['ALL', 'DEBIT', 'CREDIT'],
            range_amount_max: '1000', // Determine by backend by taking all transaction
          },
          transactions: [
            {
              currency: 'EUR',
              date: '2023-02-01T14:36:27.106Z',
              from: 'Cameleon', // KEECASH_WALLET_EUR|BTC|ETH|...|Cameleon|Business  exemple BTC,
              to: 'NetFlix 1 irland FRX2453', // merchant_name|KEECASH_WALLET_EUR,
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
          ],
        },
        {
          card_name: 'Business',
          card_currency: 'USD',
          masked_number: '512345******1234',
          filters: {
            must_contains: '',
            amount_min: '1.0',
            amount_max: '100.0',
            from_date: '2023-01-03T15:51:53.678678',
            to_date: '2023-02-02T15:51:53.678678',
            type_list_filter: ['ALL'], // ALL|DEBIT|CREDIT
            type_list: ['ALL', 'DEBIT', 'CREDIT'], // ALL|DEBIT|CREDIT
            range_amount_max: '1000',
          },
          transactions: [
            {
              currency: 'USD',
              date: '2023-02-01T14:48:00.876',
              from: 'Business', // KEECASH_WALLET_EUR|BTC|ETH|...|Cameleon|Business  exemple BTC,
              to: 'NetFlix 2 irland FRX2453', // merchant_name|KEECASH_WALLET_EUR,
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
          ],
        },
        {
          card_name: 'Mariage',
          card_currency: 'EUR',
          masked_number: '412345******1234',
          filters: {
            must_contains: '',
            amount_min: '1.0',
            amount_max: '100.0',
            from_date: '2023-01-03T15:51:53.678678',
            to_date: '2023-02-02T15:51:53.678678',
            type_list_filter: ['ALL'], // ALL|DEBIT|CREDIT
            type_list: ['ALL', 'DEBIT', 'CREDIT'], // ALL|DEBIT|CREDIT
            range_amount_max: '10000',
          },
          transactions: [
            {
              currency: 'USD',
              date: '2023-02-01T14:48:00.876',
              from: 'Mariage', // KEECASH_WALLET_EUR|BTC|ETH|...|Cameleon|Business  exemple BTC,
              to: 'NetFlix 3 irland FRX2453', // merchant_name|KEECASH_WALLET_EUR,
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
          ],
        },
      ],
    };

    return result;
  }

  @ApiOperation({ description: '' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/keecash-wallet/:keecash_wallet_currency/transactions')
  async getKeecashWalletTransactions() {
    const result = [
      {
        date: '2023-02-01T14:32:39.904Z',
        currency: 'EUR',
        from: 'BTC', // 'KEECASH_WALLET_EUR|BTC|ETH|...|Cameleon|Business (card name)',
        from_amount: '50',
        from_amount_crypto: '0.0022',
        to: 'KEECASH_WALLET_EUR', // 'KEECASH_WALLET_EUR|BTC|ETH|...|Cameleon|Business  exemple BTC',
        to_amount: '45.99',
        to_amount_crypto: '0.001875',
        description: 'Deposit',
        fix_fees: '0.99',
        percent_fees: '1.0',
        card_price_fees: '0',
        card_brand: '',
        fees_applied: '1.71',
        type: 'DEPOSIT', // 'DEPOSIT|WITHDRAWAL|TRANSFER',
        status: 'PERFORMED', // 'PERFORMED|IN_PROGRESS|REFUSED|REFUND',
        reference: 'KCXXXXX',
        exchange_rate: '15000.0',
        reason: '',
        beneficiary_name: '',
        beneficiary_url_avatar: '',
        blockchain_txid_link: '',
        metadata: { a: 'b' },
      },
      {
        date: '2023-02-05T14:32:39.904Z',
        currency: 'EUR',
        from: 'USDT_TRC20', // 'KEECASH_WALLET_EUR|BTC|ETH|...|Cameleon|Business (card name)',
        from_amount: '60.0',
        from_amount_crypto: '0',
        to: 'KEECASH_WALLET_EUR', // 'KEECASH_WALLET_EUR|BTC|ETH|...|Cameleon|Business  exemple BTC',
        to_amount: '55.00',
        to_amount_crypto: '0',
        description: 'Deposit',
        fix_fees: '0.99',
        percent_fees: '1.0',
        card_price_fees: '0',
        card_brand: '',
        fees_applied: '1.71',
        type: 'DEPOSIT', // 'DEPOSIT|WITHDRAWAL|TRANSFER',
        status: 'PERFORMED', // 'PERFORMED|IN_PROGRESS|REFUSED|REFUND',
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

  @ApiOperation({ description: '' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/keecash-wallet/:keecash_wallet_currency/transactions/:reference/invoice')
  async getKeecashWalletTransactionInvoice() {
    const result = {
      link: '',
    };

    return result;
  }

  @ApiOperation({ description: 'Get card transaction invoices' })
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/card/:card_name/transactions/')
  async getCardTransactions(@Param() param) {
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
