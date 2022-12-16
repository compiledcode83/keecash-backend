import { Module } from '@nestjs/common';
import { FeeService } from './fee.service';

@Module({
  providers: [FeeService]
})
export class FeeModule {}
