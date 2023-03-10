import { Module } from '@nestjs/common';
import { CardHistoryRepository } from './card-history.repository';
import { CardHistoryService } from './card-history.service';

@Module({
  providers: [CardHistoryService, CardHistoryRepository],
  exports: [CardHistoryService],
})
export class CardHistoryModule {}
