import { Controller } from '@nestjs/common';
import { SumsubWebhookService } from './sumsub.service';

@Controller('sumsub')
export class SumsubWebhookController {
  constructor(private readonly sumsubWebhookService: SumsubWebhookService) {}
}
