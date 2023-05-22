import { Injectable } from '@nestjs/common';
import { NotificationRepository } from './notification.repository';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async save(notification: any) {
    const notificationEntity = this.notificationRepository.create(notification);

    return this.notificationRepository.save(notificationEntity);
  }
}
