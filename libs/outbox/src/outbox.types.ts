import {
  BridgecardEventPattern,
  BridgecardCreateMessage,
  BridgecardFreezeMessage,
  BridgecardUnfreezeMessage,
} from '@app/bridgecard';
import { TransactionCreateMessage, TransactionEventPattern } from '@app/transaction';
import { UserCreateMessage, UserEventPattern } from '@app/user';

export enum OutboxStatus {
  Created = 'created',
  Sent = 'sent',
}

export type OutboxEventName = UserEventPattern | TransactionEventPattern | BridgecardEventPattern;

export type OutboxPayload =
  | UserCreateMessage
  | TransactionCreateMessage
  | BridgecardCreateMessage
  | BridgecardFreezeMessage
  | BridgecardUnfreezeMessage;
