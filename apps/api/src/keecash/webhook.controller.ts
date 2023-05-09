import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { KeecashService } from './keecash.service';
import { BridgecardWebhookResponseDto } from './dto/bridgecard-webhook-response.dto';
import { TripleADepositNotifyDto } from './dto/triple-a-deposit-notify.dto';
import { TripleAWithdrawalNotifyDto } from './dto/triple-a-withdrawal-notify.dto';

@Controller()
export class WebhookController {
  constructor(private readonly keecashService: KeecashService) {}

  // -------------- BRIDGECARD WEBHOOK -------------------

  @ApiTags('Webhook Handler')
  @Post('bridgecard/webhook')
  async handleWebhookEvent(@Body() body: BridgecardWebhookResponseDto) {
    const { event, data } = body;

    await this.keecashService.handleBridgecardWebhookEvent(event, data);
  }

  // -------------- TRIPLE-A WEBHOOK -------------------

  @ApiTags('Webhook Handler')
  @Post('triple-a/payment-notify-deposit')
  async paymentNotifyDeposit(@Body() body: TripleADepositNotifyDto) {
    await this.keecashService.handleDepositNotification(body);
  }

  @ApiTags('Webhook Handler')
  @Post('triple-a/payment-notify-withdraw')
  async paymentNotifyWithdraw(@Body() body: TripleAWithdrawalNotifyDto) {
    await this.keecashService.handleWithdrawalNotification(body);
  }
}
