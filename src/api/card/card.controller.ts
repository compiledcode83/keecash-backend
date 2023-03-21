import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { CardService } from './card.service';
import { PostDepositFeeDto } from './dto/post-deposit-fee.dto';
import { DepositPaymentLinkDto } from './dto/deposit-payment-link.dto';
import { CryptoCurrencyEnum, FiatCurrencyEnum } from '../crypto-tx/crypto-tx.types';
import { WithdrawalApplyDto } from './dto/withdrawal-apply.dto';
import { GetDashboardItemsResponseDto } from './dto/get-dashboard-items-response.dto';
import { GetCardsResponseDto } from './dto/get-cards-response.dto';

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
  async getDashboardItems(@Req() req, @Query() query): Promise<GetDashboardItemsResponseDto> {
    const wallets = await this.cardService.getCardDetailsByUserId(req.user.id);

    return {
      isSuccess: true,
      wallets,
      recommended: FiatCurrencyEnum.EUR,
    };
  }

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

  @ApiOperation({ description: 'Block all my cards' })
  @ApiTags('Card Management')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('card/block/my-card')
  async blockMyCard(@Req() req) {
    await this.cardService.setLockByUserId(req.user.id, true);

    return { isSuccess: true };
  }

  @ApiOperation({ description: 'Unlock all my cards' })
  @ApiTags('Card Management')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('card/unlock/my-card')
  async unlockMyCard(@Req() req) {
    await this.cardService.setLockByUserId(req.user.id, false);

    return { isSuccess: true };
  }

  @ApiOperation({ description: 'Unlock all my cards' })
  @ApiTags('Card Management')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('card/remove/my-card')
  async removeMyCard(@Req() req) {
    await this.cardService.removeByUserId(req.user.id);

    return { isSuccess: true };
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
