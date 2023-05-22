import { v4 as uuid } from 'uuid';
import { Transaction } from '@app/transaction';

export class TransactionWalletWithdrawalMessage {
  operationUuid: string;
  transaction: Transaction;

  constructor(data: Partial<TransactionWalletWithdrawalMessage>) {
    Object.assign(this, data);
    this.operationUuid = uuid();
  }

  toString() {
    return JSON.stringify(this);
  }
}
