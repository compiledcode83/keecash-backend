import { Injectable } from '@nestjs/common';
import { UserRepository as CommonRepository } from '@app/user';

@Injectable()
export class UserRepository extends CommonRepository {}
