import { Body, Controller, Post } from '@nestjs/common';
import { CardService } from './card.service';
import { ApiTags } from '@nestjs/swagger';
import { BridgecardWebhookResponseDto } from './dto/bridgecard-webhook-response.dto';
import { TripleADepositNotifyDto } from '@api/triple-a/dto/triple-a-deposit-notify.dto';
import { TripleAWithdrawalNotifyDto } from '@api/triple-a/dto/triple-a-withdrawal-notify.dto';

@Controller()
export class WebhookController {
  constructor(private readonly cardService: CardService) {}

  // -------------- BRIDGECARD WEBHOOK -------------------

  @ApiTags('Webhook Handler')
  @Post('bridgecard/webhook')
  async handleWebhookEvent(@Body() body: BridgecardWebhookResponseDto) {
    const { event, data } = body;

    await this.cardService.handleBridgecardWebhookEvent(event, data);
  }

  // -------------- TRIPLE-A WEBHOOK -------------------

  @ApiTags('Webhook Handler')
  @Post('triple/payment-notifiy-deposit')
  async paymentNotifyDeposit(@Body() body: TripleADepositNotifyDto) {
    await this.cardService.handleDepositNotification(body);
  }

  @ApiTags('Webhook Handler')
  @Post('triple/payment-notifiy-withdraw')
  async paymentNotifyWithdraw(@Body() body: TripleAWithdrawalNotifyDto) {
    await this.cardService.handleWithdrawalNotification(body);
  }
}
