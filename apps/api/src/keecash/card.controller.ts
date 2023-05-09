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
import { KeecashService } from './keecash.service';
import { GetCardsResponseDto } from './dto/get-cards-response.dto';
import { ManageCardDto } from './dto/manage-card.dto';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { FiatCurrencyEnum } from '@app/common';
import { GetCreateCardSettingsDto } from './dto/get-create-card-settings.dto';
import { GetCreateCardTotalFeeDto } from './dto/get-create-card-total-fee.dto';
import { CreateCardDto } from './dto/create-card.dto';

@Controller()
export class CardController {
  constructor(private readonly keecashService: KeecashService) {}

  @ApiOperation({ description: 'Get dashboard items' })
  @ApiTags('Dashboard')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('get-dashboard-items')
  async getDashboardItems(
    @Req() req,
  ): Promise<{ wallets: object; recommended: FiatCurrencyEnum; transactions: object }> {
    const dashboardItems = await this.keecashService.getDashboardItemsByUserId(req.user.id);

    return dashboardItems;
  }

  @ApiOperation({ description: 'Get my cards' })
  @ApiTags('Card Management')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('get-my-cards')
  async getCards(@Req() req): Promise<GetCardsResponseDto> {
    const cards = await this.keecashService.getCardListByUserId(req.user.id);

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
    await this.keecashService.blockCard(req.user.id, param.card_id);

    return { isSuccess: true };
  }

  @ApiOperation({ description: 'Unlock my cards' })
  @ApiParam({ name: 'card_id', required: true, description: 'Bridgecard ID' })
  @ApiTags('Card Management')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('card/unlock/:card_id')
  async unlockCard(@Req() req, @Param() param: ManageCardDto) {
    await this.keecashService.unlockCard(req.user.id, param.card_id);

    return { isSuccess: true };
  }

  @ApiOperation({ description: 'Remove all my cards' })
  @ApiParam({ name: 'card_id', required: true, description: 'Bridgecard ID' })
  @ApiTags('Card Management')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('card/remove/my-card')
  async removeMyCard(@Req() req, @Param() param: ManageCardDto) {
    await this.keecashService.delete({ userId: req.user.id, bridgecardId: param.card_id });

    return { isSuccess: true };
  }

  @ApiOperation({ description: 'Get create card settings' })
  @ApiTags('Create Card')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('card/create-cardget-settings')
  async getCreateCardSettings(@Req() req, @Query() query: GetCreateCardSettingsDto) {
    return this.keecashService.getCreateCardSettings(req.user.countryId, query.currency);
  }

  @ApiOperation({ description: 'Get fees while creating card' })
  @ApiTags('Create Card')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('card/create-cardget-fees-applied-total-to-pay')
  async getFeesAppliedTotalToPay(@Req() req, @Query() query: GetCreateCardTotalFeeDto) {
    return this.keecashService.getFeesAppliedTotalToPay(req.user.id, query);
  }

  @ApiOperation({ description: 'Create card' })
  @ApiTags('Create Card')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('card/create-cardapply')
  async applyCreateCard(@Req() req, @Body() body: CreateCardDto) {
    return this.keecashService.createCard(req.user.id, req.user.countryId, body);
  }
}
