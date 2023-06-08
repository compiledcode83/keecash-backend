import { Module } from '@nestjs/common';
import { ClosureReasonService } from './closure-reason.service';
import { UserClosureReasonRepository } from './user-closure-reason.repository';

@Module({
  providers: [ClosureReasonService, UserClosureReasonRepository],
  exports: [ClosureReasonService],
})
export class ClosureReasonModule {}
