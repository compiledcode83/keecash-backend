import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CardService } from './card.service';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { GetCreateCardTotalFeeDto } from './dto/get-create-card-total-fee.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { GetTopupSettingQueryDto } from './dto/get-topup-setting-query.dto';
import { CardBrandQueryDto } from './dto/card-brand-query.dto';

@Controller('card/create-card')
@ApiTags('Create Card')
export class CreateCardController {
  constructor(private readonly cardService: CardService) {}

  @ApiOperation({ description: 'Get create card settings' })
  @ApiOkResponse({
    description: 'Response of create card settings',
    schema: {
      example: [
        {
          currency: 'EUR',
          is_checked: true,
          min: 1,
          max: 0,
          after_decimal: 2,
          cardTypes: [
            {
              name: 'Carte à usage multiple',
              type: 'MULTIPLE',
              description: 'Rechargeable plusieurs fois',
              is_checked: true,
              price: 10,
              cardValidity: '2 years',
            },
            {
              name: 'Carte à usage unique',
              type: 'SINGLE',
              description: 'Rechargeable une fois',
              is_checked: false,
              price: 10,
              cardValidity: '2 years',
            },
          ],
        },
        {
          currency: 'USD',
          is_checked: true,
          min: 1,
          max: 0,
          after_decimal: 2,
          cardTypes: [
            {
              name: 'Carte à usage multiple',
              type: 'MULTIPLE',
              description: 'Rechargeable plusieurs fois',
              is_checked: true,
              price: 10,
              cardValidity: '2 years',
            },
            {
              name: 'Carte à usage unique',
              type: 'SINGLE',
              description: 'Rechargeable une fois',
              is_checked: false,
              price: 10,
              cardValidity: '2 years',
            },
          ],
        },
      ],
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('settings')
  async getCreateCardSettings(@Req() req, @Query() query: GetTopupSettingQueryDto) {
    return this.cardService.getCreateCardSettings(req.user.countryId, req.user.id, query);
  }

  @ApiOperation({ description: 'Get fees while creating card' })
  @ApiOkResponse({
    description: 'Get fees details response for card creation',
    schema: {
      example: {
        fixedFee: 0.99,
        percentageFee: 3.5,
        feesApplied: 11.08,
        cardPrice: 10,
        totalToPay: 12.58,
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('fees')
  async getFeesAppliedTotalToPay(@Req() req, @Body() body: GetCreateCardTotalFeeDto) {
    return this.cardService.getFeesAppliedTotalToPay(req.user.id, body);
  }

  @ApiOperation({ description: 'Create card' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('apply')
  async applyCreateCard(
    @Req() req,
    @Body() body: CreateCardDto,
    @Query() query: CardBrandQueryDto,
  ) {
    return this.cardService.createCard(req.user.id, req.user.countryId, body, query);
  }
}
