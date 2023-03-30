import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CardService } from './card.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetTransferFeeDto } from './dto/get-transfer-fee.dto';
import { TransferApplyDto } from './dto/transfer-apply.dto';
import { NotificationType } from '../notification/notification.types';
import { NotificationService } from '../notification/notification.service';

@Controller('transfer')
export class TransferController {
  constructor(
    private readonly cardService: CardService,
    private readonly notificationService: NotificationService,
  ) {}

  @ApiOperation({ description: 'Get transfer settings' })
  @ApiTags('Transfer')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('settings')
  async transferSettings(@Req() req) {
    return this.cardService.getTransferSettings(req.user.id, req.user.referralId);
  }

  @ApiOperation({ description: 'Get transfer fees' })
  @ApiTags('Transfer')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('fees')
  async transferFees(@Body() body: GetTransferFeeDto) {
    return this.cardService.getTransferFee(body);
  }

  @ApiOperation({ description: 'Apply transfer' })
  @ApiTags('Transfer')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('apply')
  async applyTransfer(@Req() req, @Body() body: TransferApplyDto): Promise<string> {
    // Create a notification for the transaction
    await this.notificationService.createOne({
      userId: req.user.id,
      type: NotificationType.TransferSent,
      amount: body.desired_amount,
      currency: body.currency,
    });

    await this.notificationService.createOne({
      userId: body.beneficiary_user_id,
      type: NotificationType.TransferReceived,
      amount: body.desired_amount,
      currency: body.currency,
    });

    return 'ok';
  }
}
