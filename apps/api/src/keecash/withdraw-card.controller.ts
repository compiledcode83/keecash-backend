import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { KeecashService } from './keecash.service';
import { GetCardWithdrawalSettingDto } from './dto/get-card-withdrawal-setting.dto';
import { ApplyCardWithdrawalDto } from './dto/card-withdrawal-apply.dto';

@Controller('card/withdrawal')
@ApiTags('Withdraw Card')
export class WithdrawCardController {
  constructor(private readonly keecashService: KeecashService) {}

  @ApiOperation({ description: 'Get card withdrawal settings' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('get-fees')
  async getCardWithdrawalSettings(@Req() req, @Query() query: GetCardWithdrawalSettingDto) {
    return this.keecashService.getCardWithdrawalSettings(req.user.countryId, query);
  }

  @ApiOperation({ description: 'Apply card withdrawal' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('apply')
  async applyCardWithdrawal(@Req() req, @Body() body: ApplyCardWithdrawalDto) {
    return this.keecashService.applyCardWithdrawal(req.user.id, req.user.countryId, body);
  }
}
