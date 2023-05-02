import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SumsubService } from './sumsub.service';
import { SumsubController } from './sumsub.controller';

@Module({
  controllers: [SumsubController],
  imports: [HttpModule],
  providers: [SumsubService],
  exports: [SumsubService],
})
export class SumsubModule {}
