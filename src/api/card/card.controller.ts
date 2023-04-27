import { Controller, Delete, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { CardService } from './card.service';
import { FiatCurrencyEnum } from '@api/transaction/transaction.types';
import { GetDashboardItemsResponseDto } from './dto/get-dashboard-items-response.dto';
import { GetCardsResponseDto } from './dto/get-cards-response.dto';

@Controller()
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @ApiOperation({ description: 'Get dashboard items' })
  @ApiTags('Dashboard')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('get-dashboard-items')
  async getDashboardItems(@Req() req): Promise<GetDashboardItemsResponseDto> {
    const wallets = await this.cardService.getDashboardItemsByUserId(req.user.id);

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

  @ApiOperation({ description: 'Block my cards' })
  @ApiParam({ name: 'card_id', required: true, description: 'Bridgecard ID' })
  @ApiTags('Card Management')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('card/block/:card_id')
  async blockCard(@Req() req, @Param('card_id') cardId: string) {
    await this.cardService.blockCard(req.user.id, cardId);

    return { isSuccess: true };
  }

  @ApiOperation({ description: 'Unlock my cards' })
  @ApiParam({ name: 'card_id', required: true, description: 'Bridgecard ID' })
  @ApiTags('Card Management')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('card/unlock/my-card')
  async unlockCard(@Req() req, @Param('card_id') cardId: string) {
    await this.cardService.unlockCard(req.user.id, cardId);

    return { isSuccess: true };
  }

  @ApiOperation({ description: 'Remove all my cards' })
  @ApiParam({ name: 'card_id', required: true, description: 'Bridgecard ID' })
  @ApiTags('Card Management')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('card/remove/my-card')
  async removeMyCard(@Req() req, @Param('card_id') cardId: string) {
    await this.cardService.delete({ userId: req.user.id, bridgecardId: cardId });

    return { isSuccess: true };
  }
}
