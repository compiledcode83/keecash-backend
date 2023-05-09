import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { KeecashService } from './keecash.service';
import { GetCardTopupSettingDto } from './dto/get-card-topup-setting.dto';
import { ApplyCardTopupDto } from './dto/card-topup-apply.dto';

@Controller('card/topup')
@ApiTags('Topup Card')
export class TopupCardController {
  constructor(private readonly keecashService: KeecashService) {}

  @ApiOperation({ description: 'Get card topup fees' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('get-fees')
  async getCardTopupSettings(@Req() req, @Query() query: GetCardTopupSettingDto) {
    return this.keecashService.getCardTopupSettings(req.user, query);
  }

  @ApiOperation({ description: 'Apply card topup' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('apply')
  async applyCardTopup(@Req() req, @Body() body: ApplyCardTopupDto) {
    return this.keecashService.applyCardTopup(req.user.id, req.user.countryId, body);
  }
}
