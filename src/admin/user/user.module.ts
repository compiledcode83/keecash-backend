import { Module } from '@nestjs/common';
import { PersonProfileModule } from '@api/user/person-profile/person-profile.module';
import { UserModule } from '@api/user/user.module';
import { AdminUserController } from './user.controller';

@Module({
  imports: [UserModule, PersonProfileModule],
  controllers: [AdminUserController],
})
export class AdminUserModule {}
