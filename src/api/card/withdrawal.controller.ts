import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CardService } from './card.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetWithdrawalFeeDto } from './dto/get-withdrawal-fee.dto';
import { WithdrawalApplyDto } from './dto/withdrawal-apply.dto';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/notification.types';

@Controller('withdrawal')
export class WithdrawalController {
  constructor(
    private readonly cardService: CardService,
    private readonly notificationService: NotificationService,
  ) {}

  @ApiOperation({ description: 'Get deposit settings' })
  @ApiTags('Withdrawal')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('settings')
  async withdrawalSettings(@Req() req) {
    return this.cardService.getWithdrawalSettings(req.user.id);
  }

  @ApiOperation({ description: 'Get withdrawal beneficiaries' })
  @ApiTags('Withdrawal')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('beneficiaries/:wallet')
  async getBeneficiaryWallets(@Param('wallet') wallet) {
    return this.cardService.getBeneficiaryWallets(wallet);
  }

  @ApiOperation({ description: 'Post withdrawal fees' })
  @ApiTags('Withdrawal')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('fees')
  async withdrawalFees(@Body() body: GetWithdrawalFeeDto) {
    return this.cardService.getWithdrawalFee(body);
  }

  @ApiOperation({ description: 'Apply withdrawal' })
  @ApiTags('Withdrawal')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('apply')
  async applyWithdrawal(@Req() req, @Body() body: WithdrawalApplyDto): Promise<string> {
    await this.notificationService.createOne({
      userId: req.user.id,
      type: NotificationType.Withdrawal,
      amount: body.desired_amount,
      currency: body.currency,
    });

    return 'ok';
  }
}
