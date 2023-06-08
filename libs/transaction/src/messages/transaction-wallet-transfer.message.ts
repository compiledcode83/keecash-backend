import { v4 as uuid } from 'uuid';
import { Transaction } from '@app/transaction';

export class TransactionWalletTransferMessage {
  operationUuid: string;
  transaction: Transaction;

  constructor(data: Partial<TransactionWalletTransferMessage>) {
    Object.assign(this, data);
    this.operationUuid = uuid();
  }

  toString() {
    return JSON.stringify(this);
  }
}
