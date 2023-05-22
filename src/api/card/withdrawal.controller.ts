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
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CardService } from './card.service';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { GetWithdrawalFeeDto } from './dto/get-withdrawal-fee.dto';
import { WithdrawalApplyDto } from './dto/withdrawal-apply.dto';

@Controller('withdrawal')
@ApiTags('Withdrawal')
export class WithdrawalController {
  constructor(private readonly cardService: CardService) {}

  @ApiOperation({ description: 'Settings to initialize frontend' })
  @ApiOkResponse({
    description: 'Deposit settings response',
    schema: {
      example: {
        keecash_wallets: [
          {
            currency: 'EUR',
            balance: 0.2,
            is_checked: true,
            after_decimal: 2,
            min: {
              BTC: 1,
              BTC_LIGHTNING: 1,
              ETH: 1,
              USDT_TRC20: 1,
              USDT_ERC20: 1,
              USDC: 1,
              BINANCE: 1,
            },
            max: {
              BTC: 100000,
              BTC_LIGHTNING: 100000,
              ETH: 100000,
              USDT_TRC20: 100000,
              USDT_ERC20: 100000,
              USDC: 100000,
              BINANCE: 100000,
            },
          },
          {
            currency: 'USD',
            balance: 0,
            is_checked: false,
            after_decimal: 2,
            min: {
              BTC: 1,
              BTC_LIGHTNING: 1,
              ETH: 1,
              USDT_TRC20: 1,
              USDT_ERC20: 1,
              USDC: 1,
              BINANCE: 1,
            },
            max: {
              BTC: 100000,
              BTC_LIGHTNING: 100000,
              ETH: 100000,
              USDT_TRC20: 100000,
              USDT_ERC20: 100000,
              USDC: 100000,
              BINANCE: 100000,
            },
          },
        ],
        withdrawal_methods: [
          {
            name: 'Bitcoin',
            code: 'BTC',
            is_checked: false,
            data: {
              EUR: {
                is_active: true,
                inactive_message: '',
                min: 0.00004,
                max: 3.985915,
                after_decimal: 6,
                exchange_rate: 25088.344771,
              },
              USD: {
                is_active: true,
                inactive_message: '',
                min: 0.000037,
                max: 3.701401,
                after_decimal: 6,
                exchange_rate: 27016.796922,
              },
            },
          },
          {
            name: 'Bitcoin Lightning',
            code: 'BTC_LIGHTNING',
            is_checked: false,
            data: {
              EUR: {
                is_active: true,
                inactive_message: '',
                min: 0.00004,
                max: 3.985915,
                after_decimal: 6,
                exchange_rate: 25088.344771,
              },
              USD: {
                is_active: true,
                inactive_message: '',
                min: 0.000037,
                max: 3.701401,
                after_decimal: 6,
                exchange_rate: 27016.796922,
              },
            },
          },
          {
            name: 'Ethereum',
            code: 'ETH',
            is_checked: false,
            data: {
              EUR: {
                is_active: true,
                inactive_message: '',
                min: 0.0006,
                max: 59.3039,
                after_decimal: 4,
                exchange_rate: 1686.229472,
              },
              USD: {
                is_active: true,
                inactive_message: '',
                min: 0.0006,
                max: 55.0557,
                after_decimal: 4,
                exchange_rate: 1816.343488,
              },
            },
          },
          {
            name: 'Tether USD (TRC20)',
            code: 'USDT_TRC20',
            is_checked: false,
            data: {
              EUR: {
                is_active: true,
                inactive_message: '',
                min: 1.07,
                max: 106917.8,
                after_decimal: 2,
                exchange_rate: 0.935298,
              },
              USD: {
                is_active: true,
                inactive_message: '',
                min: 0.99,
                max: 99251.94,
                after_decimal: 2,
                exchange_rate: 1.007537,
              },
            },
          },
          {
            name: 'Tether USD (ERC20)',
            code: 'USDT_ERC20',
            is_checked: false,
            data: {
              EUR: {
                is_active: true,
                inactive_message: '',
                min: 1.07,
                max: 106917.8,
                after_decimal: 2,
                exchange_rate: 0.935298,
              },
              USD: {
                is_active: true,
                inactive_message: '',
                min: 0.99,
                max: 99251.94,
                after_decimal: 2,
                exchange_rate: 1.007537,
              },
            },
          },
          {
            name: 'USD Coin',
            code: 'USDC',
            is_checked: false,
            data: {
              EUR: {
                is_active: true,
                inactive_message: '',
                min: 1.07,
                max: 106917.8,
                after_decimal: 2,
                exchange_rate: 0.935298,
              },
              USD: {
                is_active: true,
                inactive_message: '',
                min: 0.99,
                max: 99251.94,
                after_decimal: 2,
                exchange_rate: 1.007537,
              },
            },
          },
          {
            name: 'Binance Pay',
            code: 'BINANCE',
            is_checked: false,
            data: {
              EUR: {
                is_active: true,
                inactive_message: '',
                min: 1.07,
                max: 106917.8,
                after_decimal: 2,
                exchange_rate: 0.935298,
              },
              USD: {
                is_active: true,
                inactive_message: '',
                min: 0.99,
                max: 99251.94,
                after_decimal: 2,
                exchange_rate: 1.007537,
              },
            },
          },
        ],
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('settings')
  async getWithdrawalSettings(@Req() req): Promise<any> {
    return this.cardService.getDepositOrWithdrawalSettings(
      req.user.countryId,
      req.user.id,
      'Withdrawal',
    );
  }

  @ApiOperation({ description: 'Post withdrawal fees' })
  @ApiOkResponse({
    description: 'Withdrawal settings response',
    schema: {
      example: {
        fix_fees: 0.99,
        percent_fees: 3.5,
        fees_applied: 1.06,
        total_to_pay: 0.94,
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('fees')
  async withdrawalFees(@Req() req, @Body() query: GetWithdrawalFeeDto) {
    return this.cardService.getWithdrawalFee(req.user.countryId, query);
  }

  @ApiOperation({ description: 'Apply withdrawal' })
  @ApiResponse({
    description: 'Apply withdrawal response',
    schema: { example: 'ok' },
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('apply')
  async applyWithdrawal(@Req() req, @Body() body: WithdrawalApplyDto): Promise<any> {
    return this.cardService.applyWithdrawal(req.user, body);
  }
}
