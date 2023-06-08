import {
  EventSubscriber as EventSubscriberDecorator,
  EntitySubscriberInterface,
  InsertEvent,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Card } from './card.entity';

@EventSubscriberDecorator()
export class CardSubscriber implements EntitySubscriberInterface<Card> {
  listenTo(): any {
    return Card;
  }

  beforeInsert(card: InsertEvent<Card>): void {
    if (!card.entity.uuid) {
      card.entity.uuid = uuid();
    }
  }
}
