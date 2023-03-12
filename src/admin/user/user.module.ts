import { Module } from '@nestjs/common';
import { PersonProfileModule } from '@src/api/user/person-profile/person-profile.module';
import { UserModule } from '@src/api/user/user.module';
import { AdminUserController } from './user.controller';

@Module({
  imports: [UserModule, PersonProfileModule],
  controllers: [AdminUserController],
})
export class AdminUserModule {}
