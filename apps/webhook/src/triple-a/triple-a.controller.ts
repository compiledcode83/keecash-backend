import { Body, Controller, Post } from '@nestjs/common';
import { TripleAWebhookService } from './triple-a.service';
import { TripleADepositNotifyDto } from './dto/triple-a-deposit-notify.dto';
import { TripleAWithdrawalNotifyDto } from './dto/triple-a-withdrawal-notify.dto';

@Controller('triple-a')
export class TripleAWebhookController {
  constructor(private readonly tripleAWebhookService: TripleAWebhookService) {}

  @Post('notify-deposit')
  async notifyDeposit(@Body() body: TripleADepositNotifyDto) {
    await this.tripleAWebhookService.handleDepositNotification(body);
  }

  @Post('notify-withdraw')
  async notifyWithdraw(@Body() body: TripleAWithdrawalNotifyDto) {
    await this.tripleAWebhookService.handleWithdrawalNotification(body);
  }
}
