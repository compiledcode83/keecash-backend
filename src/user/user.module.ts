import { Module } from '@nestjs/common';
import { StorageModule } from '@src/storage/storage.module';
import { VerificationModule } from '@src/verification/verification.module';
import { PersonProfileRepository } from './person-profile.repository';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserExistsByEmailValidator } from './validator/user-exists-by-email.validator';
import { UserExistsByPhoneNumberValidator } from './validator/user-exists-by-phone-number.validator';

@Module({
  imports: [VerificationModule, StorageModule],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    UserExistsByEmailValidator,
    UserExistsByPhoneNumberValidator,
    PersonProfileRepository,
  ],
  exports: [UserService],
})
export class UserModule {}
