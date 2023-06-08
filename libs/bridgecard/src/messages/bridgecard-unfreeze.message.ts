import { v4 as uuid } from 'uuid';

export class BridgecardUnfreezeMessage {
  operationUuid: string;
  bridgecardId: string;

  constructor(data: Partial<BridgecardUnfreezeMessage>) {
    Object.assign(this, data);
    this.operationUuid = uuid();
  }

  toString() {
    return JSON.stringify(this);
  }
}
