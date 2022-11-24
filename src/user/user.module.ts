import { Module } from '@nestjs/common';
import { EmailComfirmationModule } from '@src/email-comfirmation/email-comfirmation.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserExistsByEmailValidator } from './validator/user-exists-by-email.validator';

@Module({
  imports: [EmailComfirmationModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserExistsByEmailValidator],
  exports: [UserService],
})
export class UserModule {}
