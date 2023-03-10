import { Module } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';

@Module({
  providers: [AdminAuthService]
})
export class AdminAuthModule {}
