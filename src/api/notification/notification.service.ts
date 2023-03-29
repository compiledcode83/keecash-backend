import { Injectable } from '@nestjs/common';
import { NotificationRepository } from './notification.repository';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async findAll(userId: number): Promise<void> {
    return this.notificationRepository.findAllByUserId(userId);
  }

  async createOne(notification: any) {
    return this.notificationRepository.save(notification);
  }

  async markAsReadAdll(userId: number): Promise<void> {
    return this.notificationRepository.markAsReadAll(userId);
  }
}
