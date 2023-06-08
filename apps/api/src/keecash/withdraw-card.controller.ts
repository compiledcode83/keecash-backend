<<<<<<< HEAD:apps/api/src/keecash/withdraw-card.controller.ts
import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
=======
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CardService } from './card.service';
>>>>>>> 381621e06e83efe140d01ba95f21884ffdfb849c:src/api/card/withdraw-card.controller.ts
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { KeecashService } from './keecash.service';
import { GetCardWithdrawalSettingDto } from './dto/get-card-withdrawal-setting.dto';
import { FiatCurrencyEnum } from '@api/transaction/transaction.types';

@ApiTags('Withdraw Card')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('card/withdrawal')
export class WithdrawCardController {
  constructor(private readonly keecashService: KeecashService) {}

  @ApiOperation({ description: 'Get card withdrawal settings' })
<<<<<<< HEAD:apps/api/src/keecash/withdraw-card.controller.ts
  @Get('get-fees')
  async getCardWithdrawalSettings(@Req() req, @Query() query: GetCardWithdrawalSettingDto) {
    return this.keecashService.getCardWithdrawalSettings(req.user.countryId, query);
  }

  @ApiOperation({ description: 'Apply card withdrawal' })
  @Post('apply')
  async applyCardWithdrawal(@Req() req, @Body() body: ApplyCardWithdrawalDto) {
    return this.keecashService.applyCardWithdrawal(req.user.id, req.user.countryId, body);
=======
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Card withdraw settings response',
    schema: {
      example: {
        card_info: {
          currency: 'USD',
          balance: 1,
          is_checked: true,
          min: 1,
          max: 100000,
          after_decimal: 2,
        },
        fix_fees: 0.99,
        percent_fees: 3.5,
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get(':cardId/settings')
  async getCardWithdrawalSettings(
    @Req() req,
    @Param('cardId') cardId: string,
  ): Promise<{
    card_info: {
      currency: FiatCurrencyEnum;
      balance: any;
      is_checked: boolean;
      min: number;
      max: number;
      after_decimal: number;
    };
    fix_fees: number;
    percent_fees: number;
  }> {
    return this.cardService.getCardWithdrawalSettings(req.user.countryId, req.user.id, cardId);
  }

  @ApiOperation({ description: 'Get card withdrawal fees' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post(':cardId/fees')
  async getCardWithdrawalFees(
    @Req() req,
    @Param('cardId') cardId: string,
    @Body() body: GetCardWithdrawalSettingDto,
  ) {
    return this.cardService.getCardWithdrawalFees(req.user.countryId, body, cardId);
  }

  @ApiOperation({ description: 'Apply card withdrawal' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post(':cardId/apply')
  async applyCardWithdrawal(
    @Req() req,
    @Param('cardId') cardId: string,
    @Body() body: GetCardWithdrawalSettingDto,
  ) {
    return this.cardService.applyCardWithdrawal(req.user.id, req.user.countryId, body, cardId);
>>>>>>> 381621e06e83efe140d01ba95f21884ffdfb849c:src/api/card/withdraw-card.controller.ts
  }
}
