import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CardService } from './card.service';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { GetDepositFeeDto } from './dto/get-deposit-fee.dto';
import { DepositPaymentLinkDto } from './dto/deposit-payment-link.dto';
import { NotificationService } from '@api/notification/notification.service';
import { NotificationType } from '@api/notification/notification.types';
import { TripleAService } from '@api/triple-a/triple-a.service';

@Controller('deposit')
@ApiTags('Deposit')
export class DepositController {
  constructor(
    private readonly cardService: CardService,
    private readonly notificationService: NotificationService,
    private readonly tripleAService: TripleAService,
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
  async depositFees(@Req() req, @Body() body: GetDepositFeeDto) {
    return this.cardService.getDepositFee(req.user.countryId, body);
  }

  @ApiOperation({ description: 'Post deposit payment link' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('payment-link')
  async depositPaymentLink(@Req() req, @Body() body: DepositPaymentLinkDto) {
    const res = await this.tripleAService.deposit({
      amount: body.total_to_pay,
      currency: body.keecash_wallet,
      email: req.user.email,
    });

    // TODO: Add to Redis/BullMQ message queue asynchronously
    // Create a notification for the transaction
    await this.notificationService.create({
      userId: req.user.id,
      type: NotificationType.Deposit,
      amount: body.desired_amount,
      currency: body.keecash_wallet,
    });

    return {
      link: res.hosted_url,
    };
  }
}
