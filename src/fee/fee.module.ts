import { Module } from '@nestjs/common';
import { FeeRepository } from './fee.repository';
import { FeeService } from './fee.service';

@Module({
  providers: [FeeService, FeeRepository],
  exports: [FeeService],
})
export class FeeModule {}
