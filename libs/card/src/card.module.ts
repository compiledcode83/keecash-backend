import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardRepository } from './card.repository';

@Module({
  providers: [CardService, CardRepository],
  exports: [CardService],
})
export class CardModule {}
