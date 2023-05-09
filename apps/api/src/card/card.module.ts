import { Module } from '@nestjs/common';
import { CardSubscriber } from '@app/card';
import { CardService } from './card.service';
import { CardRepository } from './card.repository';

@Module({
  providers: [CardService, CardRepository, CardSubscriber],
  exports: [CardService],
})
export class CardModule {}
