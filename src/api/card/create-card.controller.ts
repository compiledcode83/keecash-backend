import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CardService } from './card.service';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { GetCreateCardSettingsDto } from './dto/get-create-card-settings.dto';
import { GetCreateCardTotalFeeDto } from './dto/get-create-card-total-fee.dto';
import { CreateCardDto } from './dto/create-card.dto';

@Controller('card/create-card')
@ApiTags('Create Card')
export class CreateCardController {
  constructor(private readonly cardService: CardService) {}

  @ApiOperation({ description: 'Get create card settings' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('get-settings')
  async getCreateCardSettings(@Req() req, @Query() query: GetCreateCardSettingsDto) {
    return this.cardService.getCreateCardSettings(req.user.countryId, query.currency);
  }

  @ApiOperation({ description: 'Get fees while creating card' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('get-fees-applied-total-to-pay')
  async getFeesAppliedTotalToPay(@Req() req, @Query() query: GetCreateCardTotalFeeDto) {
    return this.cardService.getFeesAppliedTotalToPay(req.user.id, query);
  }

  @ApiOperation({ description: 'Create card' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('apply')
  async applyCreateCard(@Req() req, @Body() body: CreateCardDto) {
    return this.cardService.createCard(req.user.id, req.user.countryId, body);
  }
}
