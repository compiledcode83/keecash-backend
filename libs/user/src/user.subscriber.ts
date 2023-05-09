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

  beforeInsert(user: InsertEvent<User>): void {
    if (!user.entity.uuid) {
      user.entity.uuid = uuid();
    }
  }
}
