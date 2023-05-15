import { Module } from '@nestjs/common';
import { PersonProfileModule } from '@app/person-profile';
import { DocumentModule } from '@app/document';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

@Module({
  imports: [PersonProfileModule, DocumentModule],
  providers: [UserService, UserRepository],
  controllers: [UserController],
})
export class UserModule {}
