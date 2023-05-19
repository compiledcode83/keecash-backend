import { v4 as uuid } from 'uuid';

export class BridgecardFreezeMessage {
  operationUuid: string;
  bridgecardId: string;

  constructor(data: Partial<BridgecardFreezeMessage>) {
    Object.assign(this, data);
    this.operationUuid = uuid();
  }

  toString() {
    return JSON.stringify(this);
  }
}
