import { Module } from '@nestjs/common';
import { TwilioService } from './twilio.service';
import { TwilioProvider } from './twilio.provider';

@Module({
  providers: [TwilioService, TwilioProvider],
  exports: [TwilioService],
})
export class TwilioModule {}
