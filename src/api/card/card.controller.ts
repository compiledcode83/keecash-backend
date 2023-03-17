import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { CardService } from './card.service';
import { PostDepositFeeDto } from './dto/post-deposit-fee.dto';
import { DepositPaymentLinkDto } from './dto/deposit-payment-link.dto';
import { CryptoCurrencyEnum } from '../crypto-tx/crypto-tx.types';
import { WithdrawalApplyDto } from './dto/withdrawal-apply.dto';

@Controller()
export class CardController {
  constructor(private readonly cardService: CardService) {}

  // @ApiOperation({ description: `Get my all cards` })
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Get()
  // async findAllPaginated(@Request() req) {
  //   return;
  // }

  @ApiOperation({ description: 'Get dashboard items' })
  @ApiTags('Dashboard')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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

  @ApiOperation({ description: 'Get deposit settings' })
  @ApiTags('Deposit')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/deposit/settings')
  async depositSettings(@Req() req) {
    const depositSettings = {
      keecash_wallets: [
        {
          currency: 'EUR',
          balance: '10',
          is_checked: 'true', // the first element always true
          min: '0',
          max: '100000',
          after_decimal: '2',
        },
        {
          currency: 'USD',
          balance: '59.99',
          is_checked: 'false',
          min: '0',
          max: '100000',
          after_decimal: '2',
        },
      ],
      deposit_methods: [
        {
          name: 'Bitcoin',
          code: 'BTC',
          exchange_rate: [
            // same size than keecash_wallets and ordonnate in the same currency fiat
            '15000', // EUR
            '14500', // USD
          ],
          is_checked: 'false',
          min: '0',
          max: '10',
          after_decimal: '6',
        },
        {
          name: 'Bitcoin Lightning',
          code: 'BTC_LIGHTNING',
          exchange_rate: [
            // same size than keecash_wallets and ordonnate in the same currency fiat
            '15000', // EUR
            '14500', // USD
          ],
          is_checked: 'false',
          min: '0',
          max: '10',
          after_decimal: '6',
        },
        {
          name: 'Ethereum',
          code: 'ETH',
          exchange_rate: [
            // same size than keecash_wallets and ordonnate in the same currency fiat
            '1500', // EUR
            '1450', // USD
          ],
          is_checked: 'false',
          min: '0',
          max: '200',
          after_decimal: '4',
        },
        {
          name: 'Tether USD (TRC20)',
          code: 'USDT_TRC20',
          exchange_rate: [
            // same size than keecash_wallets and ordonnate in the same currency fiat
            '1.121', // EUR
            '0.994', // USD
          ],
          is_checked: 'false',
          min: '0',
          max: '100000',
          after_decimal: '2',
        },
        {
          name: 'Tether USD (ERC20)',
          code: 'USDT_ERC20',
          exchange_rate: [
            // same size than keecash_wallets and ordonnate in the same currency fiat
            '1.121', // EUR
            '0.994', // USD
          ],
          is_checked: 'false',
          min: '0',
          max: '100000',
          after_decimal: '2',
        },
        {
          name: 'USD Coin',
          code: 'USDC',
          exchange_rate: [
            // same size than keecash_wallets and ordonnate in the same currency fiat
            '1.121', // EUR
            '0.994', // USD
          ],
          is_checked: 'false',
          min: '0',
          max: '100000',
          after_decimal: '2',
        },
        {
          name: 'Binance Pay',
          code: 'BINANCE',
          exchange_rate: [
            // same size than keecash_wallets and ordonnate in the same currency fiat
            '1.121', // EUR
            '0.994', // USD
          ],
          is_checked: 'false',
          min: '0',
          max: '100000',
          after_decimal: '2',
        },
      ],
      fix_fees: '0.99',
      percent_fees: '0.01',
    };

    return depositSettings;
  }

  @ApiOperation({ description: 'Post deposit fees' })
  @ApiTags('Deposit')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/deposit/fees')
  async depositFees(@Body() body: PostDepositFeeDto) {
    const fees = {
      fix_fees: 0.99,
      percent_fees: 0.01,
      fees_applied: 0.01,
      total_to_pay: 101,
    };

    return fees;
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
    const withdrawalSettings = {
      keecash_wallets: [
        {
          currency: 'EUR',
          balance: '10',
          is_checked: 'true', // the first element always true
          min: '0',
          max: '10',
          after_decimal: '2',
        },
        {
          currency: 'USD',
          balance: '162.9',
          is_checked: 'false',
          min: '0',
          max: '162.9',
          after_decimal: '2',
        },
      ],
      withdrawal_methods: [
        {
          name: 'Bitcoin',
          code: 'BTC',
          exchange_rate: [
            // same size than keecash_wallets and ordonnate in the same currency fiat
            '15000', // EUR
            '14500', // USD
          ],
          is_checked: 'false',
          min: '0',
          max: '10',
          after_decimal: '6',
        },
        {
          name: 'Bitcoin Lightning',
          code: 'BTC_LIGHTNING',
          exchange_rate: [
            // same size than keecash_wallets and ordonnate in the same currency fiat
            '15000', // EUR
            '14500', // USD
          ],
          is_checked: 'false',
          min: '0',
          max: '10',
          after_decimal: '6',
        },
        {
          name: 'Ethereum',
          code: 'ETH',
          exchange_rate: [
            // same size than keecash_wallets and ordonnate in the same currency fiat
            '1500', // EUR
            '1450', // USD
          ],
          is_checked: 'false',
          min: '0',
          max: '200',
          after_decimal: '4',
        },
        {
          name: 'Tether USD (TRC20)',
          code: 'USDT_TRC20',
          exchange_rate: [
            // same size than keecash_wallets and ordonnate in the same currency fiat
            '1.121', // EUR
            '0.994', // USD
          ],
          is_checked: 'false',
          min: '0',
          max: '100000',
          after_decimal: '2',
        },
        {
          name: 'Tether USD (ERC20)',
          code: 'USDT_ERC20',
          exchange_rate: [
            // same size than keecash_wallets and ordonnate in the same currency fiat
            '1.121', // EUR
            '0.994', // USD
          ],
          is_checked: 'false',
          min: '0',
          max: '100000',
          after_decimal: '2',
        },
        {
          name: 'USD Coin',
          code: 'USDC',
          exchange_rate: [
            // same size than keecash_wallets and ordonnate in the same currency fiat
            '1.121', // EUR
            '0.994', // USD
          ],
          is_checked: 'false',
          min: '0',
          max: '100000',
          after_decimal: '2',
        },
        {
          name: 'Binance Pay',
          code: 'BINANCE',
          exchange_rate: [
            // same size than keecash_wallets and ordonnate in the same currency fiat
            '1.121', // EUR
            '0.994', // USD
          ],
          is_checked: 'false',
          min: '0',
          max: '100000',
          after_decimal: '2',
        },
      ],
      fix_fees: '0.99',
      percent_fees: '0.01',
    };

    return withdrawalSettings;
  }

  @ApiOperation({ description: 'Get withdrawal beneficiaries' })
  @ApiTags('Withdrawal')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/withdrawal/beneficiaries/:wallet')
  async getWithdrawalBeneficiaries(@Param('wallet') wallet) {
    const withdrawalSettings = {
      beneficiaries_wallet: [
        {
          name: 'My BTC wallet on Binance',
          type: CryptoCurrencyEnum.BTC,
          address: '0x57fe7ggeih4fe55hr5dzzf56',
        },
        {
          name: 'My BTC on Trust Wallet',
          type: CryptoCurrencyEnum.BTC,
          address: '0x57fe7ggeih4fe55hr5dzzf56',
        },
        {
          name: 'My BTC wallet on Binance',
          type: CryptoCurrencyEnum.BTC,
          address: '0x57fe7ggeih4fe55hr5dzzf56',
        },
        {
          name: 'My BTC on Trust Wallet',
          type: CryptoCurrencyEnum.BTC,
          address: '0x57fe7ggeih4fe55hr5dzzf56',
        },
        {
          name: 'My BTC wallet on Binance',
          type: CryptoCurrencyEnum.BTC,
          address: '0x57fe7ggeih4fe55hr5dzzf56',
        },
        {
          name: 'My BTC on Trust Wallet',
          type: CryptoCurrencyEnum.BTC,
          address: '0x57fe7ggeih4fe55hr5dzzf56',
        },
      ],
    };

    return withdrawalSettings;
  }

  @ApiOperation({ description: 'Post withdrawal fees' })
  @ApiTags('Withdrawal')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/withdrawal/fees')
  async withdrawalFees(@Body() body: PostDepositFeeDto) {
    const fees = {
      fix_fees: 0.99,
      percent_fees: 0.01,
      fees_applied: 0.01,
      total_to_pay: 101,
    };

    return fees;
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
