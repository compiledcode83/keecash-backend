import { Module } from '@nestjs/common';
import { ShareholderRepository } from './shareholder.repository';
import { ShareholderService } from './shareholder.service';

@Module({
  providers: [ShareholderService, ShareholderRepository],
  exports: [ShareholderService],
})
export class ShareholderModule {}
