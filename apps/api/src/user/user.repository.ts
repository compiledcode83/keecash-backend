import { Injectable } from '@nestjs/common';
import { UserRepository as CommonRepository } from '@app/user/user.repository';

@Injectable()
export class UserRepository extends CommonRepository {}
