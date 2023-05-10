import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '@app/user';
import { UserCreateReplyMessage } from './messages/user-create-reply.message';

@Injectable()
export class ConsumerService {
  private readonly logger = new Logger(ConsumerService.name);

  constructor(private readonly userService: UserService) {}

  async handleUserCreateReply(message: UserCreateReplyMessage) {
    if (message?.errorData) return;
  }
}
