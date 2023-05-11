import { UserCreateMessage, UserEventPattern } from '@app/user';

export enum OutboxStatus {
  Created = 'created',
  Sent = 'sent',
}

export type OutboxEventName = UserEventPattern;

export type OutboxPayload = UserCreateMessage;
