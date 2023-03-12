import { Module } from '@nestjs/common';
import { CardModule } from '@api/card/card.module';
import { AdminCardController } from './card.controller';

@Module({
  imports: [CardModule],
  controllers: [AdminCardController],
})
export class AdminCardModule {}
