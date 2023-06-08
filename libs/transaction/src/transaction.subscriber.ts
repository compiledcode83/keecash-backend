import {
  EventSubscriber as EventSubscriberDecorator,
  EntitySubscriberInterface,
  InsertEvent,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Transaction } from './transaction.entity';

@EventSubscriberDecorator()
export class TransactionSubscriber implements EntitySubscriberInterface<Transaction> {
  listenTo(): any {
    return Transaction;
  }

  beforeInsert(transaction: InsertEvent<Transaction>): void {
    if (!transaction.entity.uuid) {
      transaction.entity.uuid = uuid();
    }
  }
}
