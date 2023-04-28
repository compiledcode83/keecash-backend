import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CardService } from './card.service';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { GetCardTopupSettingDto } from './dto/get-card-topup-setting.dto';
import { ApplyCardTopupDto } from './dto/card-topup-apply.dto';

@Controller('card/topup')
@ApiTags('Topup Card')
export class TopupCardController {
  constructor(private readonly cardService: CardService) {}

  @ApiOperation({ description: 'Get card topup fees' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('get-fees')
  async getCardTopupSettings(@Req() req, @Query() query: GetCardTopupSettingDto) {
    return this.cardService.getCardTopupSettings(req.user.countryId, query);
  }

  @ApiOperation({ description: 'Apply card topup' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('apply')
  async applyCardTopup(@Req() req, @Body() body: ApplyCardTopupDto) {
    return this.cardService.applyCardTopup(req.user.id, req.user.countryId, body);
  }
}
