import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CardService } from './card.service';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { GetDepositFeeDto } from './dto/get-deposit-fee.dto';
import { DepositPaymentLinkDto } from './dto/deposit-payment-link.dto';

@Controller('deposit')
@ApiTags('Deposit')
export class DepositController {
  constructor(private readonly cardService: CardService) {}

  @ApiOperation({ description: 'Settings to initialize frontend' })
  @ApiOkResponse({
    description: 'Deposit settings response',
    schema: {
      example: {
        keecash_wallets: [
          {
            currency: 'EUR',
            balance: 0,
            is_checked: true,
            min: 0,
            max: 100000,
            after_decimal: 2,
          },
          {
            currency: 'USD',
            balance: 0,
            is_checked: false,
            min: 0,
            max: 100000,
            after_decimal: 2,
          },
        ],
        deposit_methods: [
          {
            name: 'Bitcoin',
            code: 'BTC',
            exchange_rate: [24488.600182, 26789.72782],
            activations: [
              {
                is_active: true,
                inactive_message: '',
              },
              {
                is_active: true,
                inactive_message: '',
              },
            ],
            is_checked: false,
            min: 0,
            max: 10,
            after_decimal: 6,
          },
          {
            name: 'Bitcoin Lightning',
            code: 'BTC_LIGHTNING',
            exchange_rate: [24488.600182, 26789.72782],
            activations: [
              {
                is_active: true,
                inactive_message: '',
              },
              {
                is_active: true,
                inactive_message: '',
              },
            ],
            is_checked: false,
            min: 0,
            max: 10,
            after_decimal: 6,
          },
          {
            name: 'Ethereum',
            code: 'ETH',
            exchange_rate: [1649.548798, 1804.552444],
            activations: [
              {
                is_active: true,
                inactive_message: '',
              },
              {
                is_active: true,
                inactive_message: '',
              },
            ],
            is_checked: false,
            min: 0,
            max: 140,
            after_decimal: 4,
          },
          {
            name: 'Tether USD (TRC20)',
            code: 'USDT_TRC20',
            exchange_rate: [0.918822, 1.005162],
            activations: [
              {
                is_active: true,
                inactive_message: '',
              },
              {
                is_active: true,
                inactive_message: '',
              },
            ],
            is_checked: 'false',
            min: 0,
            max: 100000,
            after_decimal: 2,
          },
          {
            name: 'Tether USD (ERC20)',
            code: 'USDT_ERC20',
            exchange_rate: [0.918822, 1.005162],
            activations: [
              {
                is_active: true,
                inactive_message: '',
              },
              {
                is_active: true,
                inactive_message: '',
              },
            ],
            is_checked: 'false',
            min: 0,
            max: 100000,
            after_decimal: 2,
          },
          {
            name: 'USD Coin',
            code: 'USDC',
            exchange_rate: [0.918822, 1.005162],
            activations: [
              {
                is_active: true,
                inactive_message: '',
              },
              {
                is_active: true,
                inactive_message: '',
              },
            ],
            is_checked: 'false',
            min: 0,
            max: 100000,
            after_decimal: 2,
          },
          {
            name: 'Binance Pay',
            code: 'BINANCE',
            exchange_rate: [0.918822, 1.005162],
            activations: [
              {
                is_active: true,
                inactive_message: '',
              },
              {
                is_active: true,
                inactive_message: '',
              },
            ],
            is_checked: 'false',
            min: 0,
            max: 100000,
            after_decimal: 2,
          },
        ],
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('settings')
  async getSettings(@Req() req): Promise<any> {
    return this.cardService.getDepositSettings(req.headers);
  }

  @ApiOperation({ description: 'Post deposit fees' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Deposit fee response',
    schema: {
      example: {
        fix_fees: 0.99,
        percent_fees: 0.015,
        fees_applied: 0.99,
        total_to_pay: 10.99,
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('fees')
  async depositFees(@Req() req, @Body() body: GetDepositFeeDto) {
    return this.cardService.getDepositFee(req.user.countryId, body);
  }

  @ApiOperation({ description: 'Post deposit payment link' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Payment link response',
    schema: {
      example: {
        link: 'https://example.com/payme-me',
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Post('payment-link')
  async getDepositPaymentLink(@Req() req, @Body() body: DepositPaymentLinkDto): Promise<any> {
    return this.cardService.getDepositPaymentLink(req.user, body);
  }
}
