import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CardService } from './card.service';
import { BridgecardWebhookResponseDto } from './dto/bridgecard-webhook-response.dto';
import { TripleADepositNotifyDto } from '@api/triple-a/dto/triple-a-deposit-notify.dto';
import { TripleAWithdrawalNotifyDto } from '@api/triple-a/dto/triple-a-withdrawal-notify.dto';
import { Request } from 'express';

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
  @Post('payment-notify-deposit')
  async paymentNotifyDeposit(@Body() body: TripleADepositNotifyDto, @Req() req: Request) {
    await this.cardService.handleDepositNotification(req);
  }

  @ApiTags('Webhook Handler')
  @Post('payment-notify-withdraw')
  async paymentNotifyWithdraw(@Body() body: TripleAWithdrawalNotifyDto, @Req() req: Request) {
    await this.cardService.handleWithdrawalNotification(req);
  }
}
