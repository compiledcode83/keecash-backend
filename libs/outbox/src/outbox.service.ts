import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { Outbox } from './outbox.entity';
import { OutboxRepository } from './outbox.repository';
import { OutboxEventName, OutboxPayload, OutboxStatus } from './outbox.types';

@Injectable()
export class OutboxService {
  constructor(public readonly outboxRepository: OutboxRepository) {}

  async findAll(batchSize = 100): Promise<Outbox[]> {
    return this.outboxRepository.findAll(batchSize);
  }

  async setAsSent(id: number[]): Promise<void> {
    await this.outboxRepository.setAsSent(id);
  }

  async create(
    queryRunner: QueryRunner,
    eventName: OutboxEventName,
    payload: OutboxPayload,
    sendAfter: Date = new Date(),
  ): Promise<Outbox> {
    return queryRunner.manager.save(
      this.outboxRepository.create({
        eventName,
        payload: JSON.stringify(payload),
        operationUuid: payload.operationUuid,
        sendAfter,
      }),
    );
  }
}
