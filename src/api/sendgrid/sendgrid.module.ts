import { Module } from '@nestjs/common';
import { SendgridProvider } from './sendgrid.provider';
import { SendgridService } from './sendgrid.service';

@Module({
  providers: [SendgridService, SendgridProvider],
  exports: [SendgridService],
})
export class SendgridModule {}
