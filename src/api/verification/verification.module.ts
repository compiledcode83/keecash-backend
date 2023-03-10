import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [VerificationService],
  exports: [VerificationService],
})
export class VerificationModule {}
