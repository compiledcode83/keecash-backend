<<<<<<< HEAD:apps/api/src/keecash/topup-card.controller.ts
import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseHelper } from '@app/common';
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
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CardService } from './card.service';
>>>>>>> 381621e06e83efe140d01ba95f21884ffdfb849c:src/api/card/topup-card.controller.ts
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { KeecashService } from './keecash.service';
import { GetCardTopupSettingDto } from './dto/get-card-topup-setting.dto';
import { ApplyCardTopupDto } from './dto/card-topup-apply.dto';
import { CardUsageEnum } from './card.types';
import { GetTopupSettingQueryDto } from './dto/get-topup-setting-query.dto';

@ApiTags('Topup Card')
@ApiResponse(ApiResponseHelper.unauthorized())
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('card/topup')
export class TopupCardController {
  constructor(private readonly keecashService: KeecashService) {}

  @ApiOperation({ description: 'Get wallet settings for card topup' })
  @ApiOkResponse({
    description: 'Get card top up settings response',
    schema: {
      example: {
        keecash_wallets: {
          currency: 'EUR',
          balance: 10,
          is_checked: true,
          min: 2,
          max: 10000,
          after_decimal: 2,
        },
      },
    },
  })
  @ApiParam({ name: 'cardId', required: true, description: 'Card ID' })
  @UseGuards(JwtAuthGuard)
  @Get(':cardId/settings')
  async getCardTopupSettings(
    @Req() req,
    @Param('cardId') cardId: string,
    @Query() query: GetTopupSettingQueryDto,
  ) {
    return this.cardService.getCardTopupSettings(req.user, cardId, query);
  }

  @ApiOperation({ description: 'Get card topup fees' })
<<<<<<< HEAD:apps/api/src/keecash/topup-card.controller.ts
  @Get('get-fees')
  async getCardTopupSettings(@Req() req, @Query() query: GetCardTopupSettingDto) {
    return this.keecashService.getCardTopupSettings(req.user, query);
  }

  @ApiOperation({ description: 'Apply card topup' })
  @Post('apply')
  async applyCardTopup(@Req() req, @Body() body: ApplyCardTopupDto) {
    return this.keecashService.applyCardTopup(req.user.id, req.user.countryId, body);
=======
  @ApiParam({ name: 'cardId', required: true, description: 'Card ID' })
  @ApiOkResponse({
    description: 'Get card topup fees response',
    schema: {
      example: {
        fix_fees: 0,
        percent_fees: 3.5,
        fees_applied: 3.6,
        total_to_pay: 1.08,
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':cardId/fees')
  async getCardTopupFees(
    @Req() req,
    @Param('cardId') cardId: string,
    @Body() body: GetCardTopupSettingDto,
  ) {
    return this.cardService.getCardTopupFees(req.user, body, cardId);
  }

  @ApiOperation({ description: 'Apply card topup' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post(':cardId/apply')
  async applyCardTopup(
    @Req() req,
    @Param('cardId') cardId: string,
    @Body() body: ApplyCardTopupDto,
  ) {
    return this.cardService.applyCardTopup(req.user.id, req.user.countryId, body, cardId);
>>>>>>> 381621e06e83efe140d01ba95f21884ffdfb849c:src/api/card/topup-card.controller.ts
  }
}
