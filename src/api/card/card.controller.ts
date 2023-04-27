import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { CardService } from './card.service';
import { FiatCurrencyEnum } from '@api/transaction/transaction.types';
import { GetDashboardItemsResponseDto } from './dto/get-dashboard-items-response.dto';
import { GetCardsResponseDto } from './dto/get-cards-response.dto';
import { GetCreateCardTotalFeeDto } from './dto/get-create-card-total-fee.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { GetCreateCardSettingsDto } from './dto/get-create-card-settings.dto';
import { GetCardTopupSettingDto } from './dto/get-card-topup-setting.dto';

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

  @ApiOperation({ description: 'Get create card settings' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiTags('Create Card')
  @Get('create-card/get-settings')
  async getCreateCardSettings(@Req() req, @Query() query: GetCreateCardSettingsDto) {
    return this.cardService.getCreateCardSettings(req.user.id, query);
  }

  @ApiOperation({ description: 'Get fees while creating card' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiTags('Create Card')
  @Post('create-card/get-fees-applied-total-to-pay')
  async getFeesAppliedTotalToPay(@Req() req, @Body() body: GetCreateCardTotalFeeDto) {
    return this.cardService.getFeesAppliedTotalToPay(req.user.id, body);
  }

  @ApiOperation({ description: 'Create card' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiTags('Create Card')
  @Post('create-card/apply')
  async applyCreateCard(@Req() req, @Body() body: CreateCardDto) {
    return this.cardService.createBridgecard(req.user.id, body);
  }

  @ApiOperation({ description: 'Get card topup settings' })
  @ApiTags('Card Management')
  @UseGuards(JwtAuthGuard)
  @Get('card/top-up/settings')
  async getCardTopupSettings(@Req() req, @Body() query: GetCardTopupSettingDto) {
    return this.cardService.getCardTopupSettings(req.user.countryId, query);
  }
}
