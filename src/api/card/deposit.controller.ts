import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CardService } from './card.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetDepositFeeDto } from './dto/get-deposit-fee.dto';
import { DepositPaymentLinkDto } from './dto/deposit-payment-link.dto';

@Controller('deposit')
export class DepositController {
  constructor(private readonly cardService: CardService) {}

  @ApiOperation({ description: 'Get deposit settings' })
  @ApiTags('Deposit')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('settings')
  async getDepositSettings(@Req() req) {
    return this.cardService.getDepositSettings(req.user.id);
  }

  @ApiOperation({ description: 'Post deposit fees' })
  @ApiTags('Deposit')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('fees')
  async depositFees(@Body() body: GetDepositFeeDto) {
    return this.cardService.getDepositFee(body);
  }

  @ApiOperation({ description: 'Post deposit payment link' })
  @ApiTags('Deposit')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('payment-link')
  async depositPaymentLink(@Body() body: DepositPaymentLinkDto) {
    return {
      link: '',
    };
  }
}
