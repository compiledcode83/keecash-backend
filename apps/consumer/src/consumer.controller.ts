import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { UserCompleteMessage, UserCreateMessage, UserEventPattern } from '@app/user';
import { ConsumerService } from './consumer.service';
import { TransactionCreateMessage, TransactionEventPattern } from '@app/transaction';

@Controller()
export class ConsumerController {
  private readonly logger = new Logger(ConsumerController.name);

  constructor(private readonly consumerService: ConsumerService) {}

  @EventPattern(UserEventPattern.UserCreate)
  async handleUserCreate(@Payload() message: UserCreateMessage) {
    try {
      await this.consumerService.handleUserCreate(message);
      this.logger.log(`Email verification code is sent to user ${message.user.uuid}`);
    } catch (error) {
      this.logger.error(
        `Error occured while sending email verification code to user ${message.user.uuid}`,
      );
    }
  }

  @EventPattern(UserEventPattern.UserComplete)
  async handleUserComplete(@Payload() message: UserCompleteMessage) {
    await this.consumerService.handleUserComplete(message);
    this.logger.log(`Bridgecard service is enabled for user ${message.user.uuid}`);
  }

  @EventPattern(TransactionEventPattern.TransactionCreate)
  async handleTransactionCreate(@Payload() message: TransactionCreateMessage) {
    await this.consumerService.handleTransactionCreate(message);
    this.logger.log(`Notification is created for transaction ${message.transaction.uuid}`);
  }
}
