import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CardService } from './card.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetDepositFeeDto } from './dto/get-deposit-fee.dto';
import { DepositPaymentLinkDto } from './dto/deposit-payment-link.dto';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/notification.types';

@Controller('deposit')
@ApiTags('Deposit')
export class DepositController {
  constructor(
    private readonly cardService: CardService,
    private readonly notificationService: NotificationService,
  ) {}

  @ApiOperation({ description: 'Get deposit settings' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('settings')
  async getDepositSettings(@Req() req) {
    return this.cardService.getDepositSettings(req.user.id);
  }

  @ApiOperation({ description: 'Post deposit fees' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('fees')
  async depositFees(@Body() body: GetDepositFeeDto) {
    return this.cardService.getDepositFee(body);
  }

  @ApiOperation({ description: 'Post deposit payment link' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('payment-link')
  async depositPaymentLink(@Req() req, @Body() body: DepositPaymentLinkDto) {
    // Create a notification for the transaction
    const notification = await this.notificationService.createOne({
      userId: req.user.id,
      type: NotificationType.Deposit,
      amount: body.desired_amount,
      currency: body.currency,
    });

    return {
      link: '',
    };
  }
}
