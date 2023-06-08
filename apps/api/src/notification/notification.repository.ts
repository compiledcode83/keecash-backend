import { Injectable } from '@nestjs/common';
import { NotificationRepository as CommonRepository } from '@app/notification';

@Injectable()
export class NotificationRepository extends CommonRepository {}
