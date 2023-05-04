import {
  EventSubscriber as EventSubscriberDecorator,
  EntitySubscriberInterface,
  InsertEvent,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { User } from './user.entity';

@EventSubscriberDecorator()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo(): any {
    return User;
  }

  beforeInsert(admin: InsertEvent<User>): void {
    if (!admin.entity.uuid) {
      admin.entity.uuid = uuid();
    }
  }
}
