import { Controller, Delete, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { CardService } from './card.service';
import { FiatCurrencyEnum } from '@api/transaction/transaction.types';
import { GetCardsResponseDto } from './dto/get-cards-response.dto';
import { ManageCardDto } from './dto/manage-card.dto';

@Controller('dashboard')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @ApiOperation({ description: 'Get dashboard items' })
  @ApiOkResponse({
    description: 'Dashboard items for UI',
    schema: {
      example: {
        isSuccess: true,
        wallets: [
          {
            balance: 1000,
            currency: 'EUR',
            cards: [
              {
                balance: 450,
                currency: '€',
                cardNumber: '512344******1234',
                name: 'Cameleon',
                date: '03/12',
              },
              {
                balance: 550,
                currency: '€',
                cardNumber: '512344******4321',
                name: 'Famous',
                date: '02/12',
              },
            ],
          },
          {
            balance: 1550,
            currency: 'USD',
            cards: [
              {
                balance: 1550,
                currency: '$',
                cardNumber: '412344******1873',
                name: 'Pasquier',
                date: '03/12',
              },
            ],
          },
        ],
        recommended: 'EUR',
        transactions: [
          {
            amount: 200,
            currency: '$',
            date: '2022-11-12 07:30',
            from: 'From back',
            to: 'Front',
            type: 'income',
          },
          {
            amount: 40,
            currency: '$',
            date: '2022-11-12 07:30',
            from: 'From back',
            to: 'Front',
            type: 'outgoing',
          },
          {
            amount: 150,
            currency: '$',
            date: '2022-11-12 07:30',
            from: 'From back',
            to: 'Front',
            type: 'income',
          },
        ],
      },
    },
  })
  @ApiTags('Dashboard')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('items')
  async getDashboardItems(
    @Req() req,
  ): Promise<{ wallets: object; recommended: FiatCurrencyEnum; transactions: object }> {
    const dashboardItems = await this.cardService.getDashboardItemsByUserId(req.user.id);

    return dashboardItems;
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

  @ApiOperation({ description: 'Block my cards' })
  @ApiParam({ name: 'card_id', required: true, description: 'Bridgecard ID' })
  @ApiTags('Card Management')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('card/block/:card_id')
  async blockCard(@Req() req, @Param() param: ManageCardDto) {
    await this.cardService.blockCard(req.user.id, param.card_id);

    return { isSuccess: true };
  }

  @ApiOperation({ description: 'Unlock my cards' })
  @ApiParam({ name: 'card_id', required: true, description: 'Bridgecard ID' })
  @ApiTags('Card Management')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('card/unlock/:card_id')
  async unlockCard(@Req() req, @Param() param: ManageCardDto) {
    await this.cardService.unlockCard(req.user.id, param.card_id);

    return { isSuccess: true };
  }

  @ApiOperation({ description: 'Remove all my cards' })
  @ApiParam({ name: 'card_id', required: true, description: 'Bridgecard ID' })
  @ApiTags('Card Management')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('card/remove/my-card')
  async removeMyCard(@Req() req, @Param() param: ManageCardDto) {
    await this.cardService.delete({ userId: req.user.id, bridgecardId: param.card_id });

    return { isSuccess: true };
  }
}
