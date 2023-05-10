import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { UserEventPattern } from '@app/user';
import { ConsumerService } from './consumer.service';
import { UserCreateReplyMessage } from './messages/user-create-reply.message';

@Controller()
export class ConsumerController {
  private readonly logger = new Logger(ConsumerController.name);

  constructor(private readonly consumerService: ConsumerService) {}

  @EventPattern(UserEventPattern.UserCreateReply)
  async handleUserCreateReply(@Payload() message: UserCreateReplyMessage) {
    await this.consumerService.handleUserCreateReply(message);
    this.logger.log(`Created user`);
  }
}
