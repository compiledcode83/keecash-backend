import { v4 as uuid } from 'uuid';
import { Transaction } from '@app/transaction';

export class TransactionCreateMessage {
  operationUuid: string;
  transaction: Transaction;

  constructor(data: Partial<TransactionCreateMessage>) {
    Object.assign(this, data);
    this.operationUuid = uuid();
  }

  toString() {
    return JSON.stringify(this);
  }
}
