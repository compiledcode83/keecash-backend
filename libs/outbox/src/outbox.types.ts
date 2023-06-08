import {
  BridgecardEventPattern,
  BridgecardCreateMessage,
  BridgecardFreezeMessage,
  BridgecardUnfreezeMessage,
} from '@app/bridgecard';
import {
  TransactionCardCreationMessage,
  TransactionCardTopupMessage,
  TransactionCardWithdrawalMessage,
  TransactionEventPattern,
  TransactionWalletDepositMessage,
  TransactionWalletTransferMessage,
  TransactionWalletWithdrawalMessage,
} from '@app/transaction';
import { UserCreateMessage, UserEventPattern } from '@app/user';

export enum OutboxStatus {
  Created = 'created',
  Sent = 'sent',
}

export type OutboxEventName = UserEventPattern | TransactionEventPattern | BridgecardEventPattern;

export type OutboxPayload =
  | UserCreateMessage
  | TransactionWalletDepositMessage
  | TransactionWalletWithdrawalMessage
  | TransactionWalletTransferMessage
  | TransactionCardCreationMessage
  | TransactionCardTopupMessage
  | TransactionCardWithdrawalMessage
  | BridgecardCreateMessage
  | BridgecardFreezeMessage
  | BridgecardUnfreezeMessage;
