import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { DataSource, In, LessThanOrEqual, Repository, UpdateResult } from 'typeorm';
import { Outbox } from './outbox.entity';
import { OutboxStatus } from './outbox.types';

@Injectable()
export class OutboxRepository extends Repository<Outbox> {
  constructor(private readonly dataSource: DataSource) {
    super(Outbox, dataSource.manager);
  }

  async findAll(batchSize: number): Promise<Outbox[]> {
    return this.find({
      where: {
        status: OutboxStatus.Created,
        sendAfter: LessThanOrEqual(DateTime.now().toUTC().toJSDate()),
      },
      take: batchSize,
    });
  }

  async setAsSent(id: number[]): Promise<UpdateResult> {
    return this.update({ id: In(id) }, { status: OutboxStatus.Sent, sentAt: new Date() });
  }
}
