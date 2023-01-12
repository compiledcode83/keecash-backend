import { Module } from '@nestjs/common';
import { AuthModule } from '@src/auth/auth.module';
import { UserModule } from '@src/user/user.module';
import { VerificationModule } from '@src/verification/verification.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [UserModule, VerificationModule, AuthModule, UserModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
