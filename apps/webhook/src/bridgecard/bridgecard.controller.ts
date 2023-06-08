import { Body, Controller, Post } from '@nestjs/common';
import { BridgecardWebhookService } from './bridgecard.service';
import { BridgecardWebhookResponseDto } from './dto/bridgecard-webhook-response.dto';

@Controller('bridgecard')
export class BridgecardWebhookController {
  constructor(private readonly bridgecardWebhookService: BridgecardWebhookService) {}

  @Post()
  async handleWebhookEvent(@Body() body: BridgecardWebhookResponseDto) {
    const { event, data } = body;

    await this.bridgecardWebhookService.handleBridgecardWebhookEvent(event, data);
  }
}
