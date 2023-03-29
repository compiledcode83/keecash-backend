import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationRepository extends Repository<Notification> {
  constructor(private readonly dataSource: DataSource) {
    super(Notification, dataSource.manager);
  }

  async findAllByUserId(userId: number): Promise<any> {
    const notifications = await this.createQueryBuilder('notification')
      .where({ userId })
      .select([
        'type',
        'has_read',
        'message',
        'amount',
        'currency',
        'url_avatar',
        'card_brand',
        'card_name',
      ])
      .getRawMany();

    return notifications;
  }

  async markAsReadAll(userId: number): Promise<void> {
    await this.createQueryBuilder()
      .update(Notification)
      .set({ hasRead: true })
      .where({ userId })
      .execute();
  }
}
