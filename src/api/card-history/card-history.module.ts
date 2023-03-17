import { Module } from '@nestjs/common';
import { CardHistoryRepository } from './card-history.repository';
import { CardHistoryService } from './card-history.service';
import { CardHistoryController } from './card-history.controller';

@Module({
  providers: [CardHistoryService, CardHistoryRepository],
  exports: [CardHistoryService],
  controllers: [CardHistoryController],
})
export class CardHistoryModule {}
