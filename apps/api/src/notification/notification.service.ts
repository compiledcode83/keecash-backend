import { Injectable } from '@nestjs/common';
import { NotificationRepository } from './notification.repository';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async findAll(userId: number): Promise<void> {
    return this.notificationRepository.findAllByUserId(userId);
  }

  async markAsReadAll(userId: number): Promise<void> {
    return this.notificationRepository.markAsReadAll(userId);
  }
}
