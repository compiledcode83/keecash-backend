import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseHelper } from '@app/common';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { KeecashService } from './keecash.service';
import { GetCardTopupSettingDto } from './dto/get-card-topup-setting.dto';
import { ApplyCardTopupDto } from './dto/card-topup-apply.dto';

@ApiTags('Topup Card')
@ApiResponse(ApiResponseHelper.unauthorized())
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('card/topup')
export class TopupCardController {
  constructor(private readonly keecashService: KeecashService) {}

  @ApiOperation({ description: 'Get card topup fees' })
  @Get('get-fees')
  async getCardTopupSettings(@Req() req, @Query() query: GetCardTopupSettingDto) {
    return this.keecashService.getCardTopupSettings(req.user, query);
  }

  @ApiOperation({ description: 'Apply card topup' })
  @Post('apply')
  async applyCardTopup(@Req() req, @Body() body: ApplyCardTopupDto) {
    return this.keecashService.applyCardTopup(req.user.id, req.user.countryId, body);
  }
}
