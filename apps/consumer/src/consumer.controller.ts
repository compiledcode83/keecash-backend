import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { UserCompleteMessage, UserCreateMessage, UserEventPattern } from '@app/user';
import { ConsumerService } from './consumer.service';
import {
  TransactionCardCreationMessage,
  TransactionCardTopupMessage,
  TransactionCardWithdrawalMessage,
  TransactionEventPattern,
  TransactionWalletDepositMessage,
  TransactionWalletTransferMessage,
  TransactionWalletWithdrawalMessage,
} from '@app/transaction';
import {
  BridgecardCreateMessage,
  BridgecardEventPattern,
  BridgecardFreezeMessage,
  BridgecardUnfreezeMessage,
} from '@app/bridgecard';

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

  @EventPattern(TransactionEventPattern.WalletDeposit)
  async handleTransactionCreate(@Payload() message: TransactionWalletDepositMessage) {
    await this.consumerService.handleTransactionWalletDeposit(message);
    // this.logger.log(`Notification is created for transaction ${message.transaction.uuid}`);
  }

  @EventPattern(TransactionEventPattern.WalletWithdrawal)
  async handleTransactionWalletWithdrawal(@Payload() message: TransactionWalletWithdrawalMessage) {
    await this.consumerService.handleTransactionWalletWithdrawal(message);
    // this.logger.log(`Notification is created for transaction ${message.transaction.uuid}`);
  }

  @EventPattern(TransactionEventPattern.WalletTransfer)
  async handleTransactionWalletTransfer(@Payload() message: TransactionWalletTransferMessage) {
    await this.consumerService.handleTransactionWalletTransfer(message);
    // this.logger.log(`Notification is created for transaction ${message.transaction.uuid}`);
  }

  @EventPattern(TransactionEventPattern.CardCreation)
  async handleTransactionCardCreation(@Payload() message: TransactionCardCreationMessage) {
    await this.consumerService.handleTransactionCardCreation(message);
    // this.logger.log(`Notification is created for transaction ${message.transaction.uuid}`);
  }

  @EventPattern(TransactionEventPattern.CardTopup)
  async handleTransactionCardTopup(@Payload() message: TransactionCardTopupMessage) {
    await this.consumerService.handleTransactionCardTopup(message);
    // this.logger.log(`Notification is created for transaction ${message.transaction.uuid}`);
  }

  @EventPattern(TransactionEventPattern.CardWithdrawal)
  async handleTransactionCardWithdrawal(@Payload() message: TransactionCardWithdrawalMessage) {
    await this.consumerService.handleTransactionCardWithdrawal(message);
    // this.logger.log(`Notification is created for transaction ${message.transaction.uuid}`);
  }

  @EventPattern(BridgecardEventPattern.BridgecardCreate)
  async handleBridgecardCreate(@Payload() message: BridgecardCreateMessage) {
    try {
      await this.consumerService.handleBridgecardCreate(message);
      this.logger.log(`Create request is sent for card ${message.cardUuid}`);
    } catch (err) {
      const { data } = err.response || {};
      this.logger.error(data?.message || 'Failed to create a new card and topup');
    }
  }

  @EventPattern(BridgecardEventPattern.BridgecardFreeze)
  async handleBridgecardFreeze(@Payload() message: BridgecardFreezeMessage) {
    try {
      await this.consumerService.handleBridgecardFreeze(message);
      this.logger.log(`Freeze request is sent for card ${message.bridgecardId}`);
    } catch (err) {
      const { data } = err.response || {};
      this.logger.error(`${data?.message || 'Failed to freeze card'} ${message.bridgecardId}`);
    }
  }

  @EventPattern(BridgecardEventPattern.BridgecardUnfreeze)
  async handleBridgecardUnfreeze(@Payload() message: BridgecardUnfreezeMessage) {
    try {
      await this.consumerService.handleBridgecardUnfreeze(message);
      this.logger.log(`Freeze request is sent for card ${message.bridgecardId}`);
    } catch (err) {
      const { data } = err.response || {};
      this.logger.error(`${data?.message || 'Failed to unfreeze card'} ${message.bridgecardId}`);
    }
  }
}
