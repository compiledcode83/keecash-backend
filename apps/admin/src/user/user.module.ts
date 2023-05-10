import { Module } from '@nestjs/common';
import { PersonProfileModule } from '@app/person-profile';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

@Module({
  imports: [PersonProfileModule],
  providers: [UserService, UserRepository],
  controllers: [UserController],
})
export class UserModule {}
