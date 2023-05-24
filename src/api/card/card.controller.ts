import { Controller, Delete, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { CardService } from './card.service';
import { FiatCurrencyEnum } from '@api/transaction/transaction.types';
import { GetCardsResponseDto } from './dto/get-cards-response.dto';
import { ManageCardDto } from './dto/manage-card.dto';

@Controller('')
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
            balance: 27.2,
            currency: 'EUR',
            cards: [],
          },
          {
            balance: 0,
            currency: 'USD',
            cards: [
              {
                cardId: 'c8f9b******fddc',
                currency: 'USD',
                cardNumber: '4**************2',
                name: 'Business',
                date: '02/26',
              },
              {
                cardId: 'f3d22*****3',
                currency: 'USD',
                cardNumber: '4**************1',
                name: 'Wedding',
                date: '04/23',
              },
            ],
          },
        ],
        recommended: 'EUR',
        transactions: [
          {
            amount: 0.1,
            currency: 'EUR',
            date: '2023-05-17T17:43:10.214Z',
            to: '',
            type: 'income',
          },
          {
            amount: 0.1,
            currency: 'EUR',
            date: '2023-05-18T09:16:51.620Z',
            to: '',
            type: 'income',
          },
          {
            amount: 1,
            currency: 'EUR',
            date: '2023-05-18T22:09:37.281Z',
            to: '',
            type: 'income',
          },
          {
            amount: 2,
            currency: 'EUR',
            date: '2023-05-18T23:21:46.606Z',
            to: '',
            type: 'income',
          },
          {
            amount: 2,
            currency: 'EUR',
            date: '2023-05-19T02:39:14.588Z',
            to: '',
            type: 'income',
          },
          {
            amount: 2,
            currency: 'EUR',
            date: '2023-05-19T02:44:52.826Z',
            to: '',
            type: 'income',
          },
          {
            amount: 20,
            currency: 'EUR',
            date: '2023-05-21T22:18:50.515Z',
            to: '',
            type: 'income',
          },
        ],
      },
    },
  })
  @ApiTags('Dashboard')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('dashboard/items')
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
  @Get('my-cards')
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
  @Patch('card/:card_id/block')
  async blockCard(@Req() req, @Param() param: ManageCardDto) {
    await this.cardService.blockCard(req.user.id, param.card_id);

    return { isSuccess: true };
  }

  @ApiOperation({ description: 'Unlock my cards' })
  @ApiParam({ name: 'card_id', required: true, description: 'Bridgecard ID' })
  @ApiTags('Card Management')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('card/:card_id/unlock')
  async unlockCard(@Req() req, @Param() param: ManageCardDto) {
    await this.cardService.unlockCard(req.user.id, param.card_id);

    return { isSuccess: true };
  }

  @ApiOperation({ description: 'Remove all my cards' })
  @ApiParam({ name: 'card_id', required: true, description: 'Bridgecard ID' })
  @ApiTags('Card Management')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('card/:card_id/remove')
  async removeMyCard(@Req() req, @Param() param: ManageCardDto) {
    await this.cardService.delete({ userId: req.user.id, bridgecardId: param.card_id });

    return { isSuccess: true };
  }
}
