import { Module } from '@nestjs/common';
import { BridgecardService } from './bridgecard.service';

@Module({
  providers: [BridgecardService],
  exports: [BridgecardService],
})
export class BridgecardModule {}
