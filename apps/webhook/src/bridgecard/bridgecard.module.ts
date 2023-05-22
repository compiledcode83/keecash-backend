import { Module } from '@nestjs/common';
import { UserModule } from '@app/user';
import { BridgecardWebhookController } from './bridgecard.controller';
import { BridgecardWebhookService } from './bridgecard.service';

@Module({
  imports: [UserModule],
  controllers: [BridgecardWebhookController],
  providers: [BridgecardWebhookService],
  exports: [BridgecardWebhookService],
})
export class BridgecardWebhookModule {}
