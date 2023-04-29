import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CardService } from './card.service';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { GetDepositFeeDto } from './dto/get-deposit-fee.dto';
import { DepositPaymentLinkDto } from './dto/deposit-payment-link.dto';

@Controller('deposit')
@ApiTags('Deposit')
export class DepositController {
  constructor(private readonly cardService: CardService) {}

  // @ApiOperation({ description: 'Get deposit settings' })
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Get('settings')
  // async getDepositSettings(@Req() req) {
  //   return this.cardService.getDepositSettings(req.user.id);
  // }

  @ApiOperation({ description: 'Post deposit fees' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('fees')
  async depositFees(@Req() req, @Query() query: GetDepositFeeDto) {
    return this.cardService.getDepositFee(req.user.countryId, query);
  }

  @ApiOperation({ description: 'Post deposit payment link' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('payment-link')
  async getDepositPaymentLink(@Req() req, @Body() body: DepositPaymentLinkDto): Promise<any> {
    return this.cardService.getDepositPaymentLink(req.user, body);
  }
}
