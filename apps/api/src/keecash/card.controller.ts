import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  FiatCurrencyEnum,
  ParamToBodyInterceptor,
  RequestToBodyInterceptor,
  RequestToQueryInterceptor,
} from '@app/common';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { KeecashService } from './keecash.service';
import { GetCardsResponseDto } from './dto/get-cards-response.dto';
import { ManageCardDto } from './dto/manage-card.dto';
import { GetCreateCardSettingsDto } from './dto/get-create-card-settings.dto';
import { GetCreateCardTotalFeeDto } from './dto/get-create-card-total-fee.dto';
import { CreateCardDto } from './dto/create-card.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class CardController {
  constructor(private readonly keecashService: KeecashService) {}

  @ApiOperation({ description: 'Get dashboard items' })
  @ApiTags('Dashboard')
  @UseInterceptors(ClassSerializerInterceptor, new RequestToQueryInterceptor('user', 'user'))
  @Get('get-dashboard-items')
  async getDashboardItems(@Query('user') user): Promise<{
    wallets: object;
    recommended: FiatCurrencyEnum;
    transactions: object;
  }> {
    const dashboardItems = await this.keecashService.getDashboardItemsByUserUuid(user.uuid);

    return dashboardItems;
  }

  @ApiOperation({ description: 'Get my cards' })
  @ApiTags('Card Management')
  @UseInterceptors(ClassSerializerInterceptor, new RequestToQueryInterceptor('user', 'user'))
  @Get('get-my-cards')
  async getCards(@Query('user') user): Promise<GetCardsResponseDto> {
    const cards = await this.keecashService.getCardListByUserUuid(user.uuid);

    return {
      isSuccess: true,
      myCards: cards,
    };
  }

  @ApiOperation({ description: 'Block my cards' })
  @ApiParam({ name: 'card_id', required: true, description: 'Bridgecard ID' })
  @ApiTags('Card Management')
  @UseInterceptors(
    ClassSerializerInterceptor,
    new RequestToBodyInterceptor('user', 'user'),
    new ParamToBodyInterceptor('card_id', 'cardId'),
  )
  @Patch('card/block/:card_id')
  async blockCard(@Body() body: ManageCardDto) {
    await this.keecashService.blockCard(body);

    return { isSuccess: true };
  }

  @ApiOperation({ description: 'Unlock my cards' })
  @ApiParam({ name: 'card_id', required: true, description: 'Bridgecard ID' })
  @ApiTags('Card Management')
  @UseInterceptors(
    ClassSerializerInterceptor,
    new RequestToBodyInterceptor('user', 'user'),
    new ParamToBodyInterceptor('card_id', 'cardId'),
  )
  @Patch('card/unlock/:card_id')
  async unlockCard(@Body() body: ManageCardDto) {
    await this.keecashService.unlockCard(body);

    return { isSuccess: true };
  }

  @ApiOperation({ description: 'Remove all my cards' })
  @ApiParam({ name: 'card_id', required: true, description: 'Bridgecard ID' })
  @ApiTags('Card Management')
  @UseInterceptors(
    ClassSerializerInterceptor,
    new RequestToBodyInterceptor('user', 'user'),
    new ParamToBodyInterceptor('card_id', 'cardId'),
  )
  @Delete('card/remove/:card_id')
  async removeMyCard(@Body() body: ManageCardDto) {
    await this.keecashService.removeCard(body);

    return { isSuccess: true };
  }

  @ApiOperation({ description: 'Get create card settings' })
  @ApiTags('Create Card')
  @UseInterceptors(ClassSerializerInterceptor, new RequestToQueryInterceptor('user', 'user'))
  @Get('card/create-card/get-settings')
  async getCreateCardSettings(@Query() query: GetCreateCardSettingsDto) {
    return this.keecashService.getCreateCardSettings(query);
  }

  @ApiOperation({ description: 'Get fees while creating card' })
  @ApiTags('Create Card')
  @UseInterceptors(ClassSerializerInterceptor, new RequestToQueryInterceptor('user', 'user'))
  @Get('card/create-card/get-fees-applied-total-to-pay')
  async getFeesAppliedTotalToPay(@Query() query: GetCreateCardTotalFeeDto) {
    return this.keecashService.getFeesAppliedTotalToPay(query);
  }

  @ApiOperation({ description: 'Create card' })
  @ApiTags('Create Card')
  @UseInterceptors(ClassSerializerInterceptor, new RequestToBodyInterceptor('user', 'user'))
  @Post('card/create-card-apply')
  async applyCreateCard(@Body() body: CreateCardDto) {
    return this.keecashService.createCard(body);
  }
}
