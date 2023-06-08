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
        'created_at as date',
        'type',
        `case when has_read = true then 'READ' else 'UNREAD' end as status `,
        'message',
        'amount',
        'currency',
        `case when url_avatar is null then '' else url_avatar end as url_avatar`,
        `case when card_brand is null then '' else card_brand end as card_brand`,
        `case when card_name is null then '' else card_name end as card_name`,
      ])
      .getRawMany();

    return { notifications };
  }

  async markAsReadAll(userId: number): Promise<void> {
    await this.createQueryBuilder()
      .update(Notification)
      .set({ hasRead: true })
      .where({ userId })
      .execute();
  }
}
