import { v4 as uuid } from 'uuid';
import { User } from '../user.entity';

export class UserCreateMessage {
  operationUuid: string;
  user: User;

  constructor(data: Partial<UserCreateMessage>) {
    Object.assign(this, data);
    this.operationUuid = uuid();
  }

  toString() {
    return JSON.stringify(this);
  }
}
