import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationRepository } from './notification.repository';

@Module({
  providers: [NotificationService, NotificationRepository],
  exports: [NotificationService],
})
export class NotificationModule {}
