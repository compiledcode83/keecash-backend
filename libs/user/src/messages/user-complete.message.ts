import { v4 as uuid } from 'uuid';
import { User } from '../user.entity';

export class UserCompleteMessage {
  operationUuid: string;
  user: User;

  constructor(data: Partial<UserCompleteMessage>) {
    Object.assign(this, data);
    this.operationUuid = uuid();
  }

  toString() {
    return JSON.stringify(this);
  }
}
