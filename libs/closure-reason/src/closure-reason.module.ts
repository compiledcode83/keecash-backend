import { Module, forwardRef } from '@nestjs/common';
import { ClosureReasonService } from './closure-reason.service';
import { UserClosureReasonRepository } from './user-closure-reason.repository';
import { UserModule } from '@api/user/user.module';

@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [ClosureReasonService, UserClosureReasonRepository],
  exports: [ClosureReasonService],
})
export class ClosureReasonModule {}
