import { HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserCompleteMessage, UserCreateMessage, UserService, UserStatus } from '@app/user';
import { TwilioService } from '@app/twilio';
import {
  BridgecardCreateMessage,
  BridgecardFreezeMessage,
  BridgecardService,
  BridgecardUnfreezeMessage,
} from '@app/bridgecard';
import {
  Transaction,
  TransactionCardCreationMessage,
  TransactionCardTopupMessage,
  TransactionCardWithdrawalMessage,
  TransactionEventPattern,
  TransactionService,
  TransactionStatusEnum,
  TransactionTypeEnum,
  TransactionWalletDepositMessage,
  TransactionWalletTransferMessage,
  TransactionWalletWithdrawalMessage,
} from '@app/transaction';
import { OutboxService } from '@app/outbox';
import { NotificationService, NotificationType } from '@app/notification';
import { PricingService } from '@app/pricing';

@Injectable()
export class ConsumerService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    private readonly twilioService: TwilioService,
    private readonly bridgecardService: BridgecardService,
    private readonly transactionService: TransactionService,
    private readonly outboxService: OutboxService,
    private readonly notificationService: NotificationService,
    private readonly pricingService: PricingService,
  ) {}

  async handleUserCreate(message: UserCreateMessage): Promise<void> {
    await this.twilioService.sendEmailVerificationCode(message.user.email);
  }

  async handleUserComplete(message: UserCompleteMessage): Promise<void> {
    const {
      uuid,
      email,
      phoneNumber,
      country: { name },
      personProfile: { firstName, lastName, address1, address2, city, state, zipcode },
    } = await this.userService.findOneWithProfileAndDocuments(
      { uuid: message.user.uuid },
      true,
      false,
    );

    const body = {
      first_name: firstName,
      last_name: lastName,
      address: {
        address: address1,
        city,
        state: state,
        country: name,
        postal_code: zipcode,
        house_no: address2,
      },
      phone: phoneNumber,
      email_address: email,
      identity: {
        id_type: 'UNITED_STATES_DRIVERS_LICENSE', // user.documents[0].type
        id_no: '',
        id_image: '',
        bvn: '',
      },
      meta_data: {
        keecash_user_id: uuid,
      },
    };

    // const body = {
    //   first_name: 'HOL',
    //   last_name: 'MAYISSA BOUSSAMBA',
    //   address: {
    //     address: 'Libreville',
    //     city: 'Libreville',
    //     state: 'Estuaire',
    //     country: 'Gabon',
    //     postal_code: '24100',
    //     house_no: '01',
    //   },
    //   phone: '24166283620',
    //   email_address: 'buy@keecash.com',
    //   identity: {
    //     id_type: 'GABON_PASSPORT',
    //     id_no: '19GA17139',
    //     id_image:
    //       'https://firebasestorage.googleapis.com/v0/b/bridgecard-issuing.appspot.com/o/Screenshot%202023-02-16%20at%206.46.36%20PM.png?alt=media&token=d90d7c36-e761-4edf-9abc-c77791af846a',
    //     selfie_image:
    //       'https://firebasestorage.googleapis.com/v0/b/keecash-8b2cc.appspot.com/o/users%2FdZ5Ja2yRXcQBjHOnWU2HGXz0Lir1%2Fhol_selfie.jpg?alt=media&token=66426d57-91aa-4196-abde-a799cfb2824b',
    //   },
    //   meta_data: { keecash_user_id: 1 },
    // };

    const res = await this.bridgecardService.registerCardholderAsync(body);

    if (res.status === HttpStatus.CREATED) {
      await this.userService.update(body.meta_data.keecash_user_id, {
        cardholderId: res.data.data.cardholder_id,
        status: UserStatus.Completed,
      });
    }
  }

  async handleTransactionWalletDeposit(message: TransactionWalletDepositMessage) {
    const { transaction } = message;

    const { referralId, referralAppliedId, countryId } = await this.userService.findOne({
      id: transaction.userId,
    });

    // If user is referred to KeeCash, send referral fees to referer
    const referralUser = await this.userService.findOne({ referralId: referralAppliedId });
    if (referralUser) {
      const { fixedFee, percentFee } = await this.pricingService.findReferralFee({ countryId });

      await this.transactionService.create({
        receiverId: referralUser.id,
        appliedFee: parseFloat(
          ((transaction.affectedAmount * percentFee) / 100 + fixedFee).toFixed(2),
        ),
        fixedFee,
        percentFee,
        type: TransactionTypeEnum.ReferralFee,
        currency: transaction.currency,
        tripleAPaymentReference: transaction.tripleAPaymentReference,
        status: TransactionStatusEnum.Performed,
        description: `Referral fee from ${referralId}'s deposit`,
      });
    }

    // Create a notification
    await this.notificationService.save({
      userId: transaction.userId,
      type: NotificationType.Deposit,
      message: `You deposited ${transaction.affectedAmount} ${transaction.currency}`,
      amount: transaction.affectedAmount,
      currency: transaction.currency,
    });
  }

  async handleTransactionWalletWithdrawal(message: TransactionWalletWithdrawalMessage) {
    const { transaction } = message;

    // Create a notification
    await this.notificationService.save({
      userId: transaction.userId,
      type: NotificationType.Withdrawal,
      message: `You withdrew ${-transaction.affectedAmount} ${transaction.currency}`,
      amount: -transaction.affectedAmount,
      currency: transaction.currency,
    });
  }

  async handleTransactionWalletTransfer(message: TransactionWalletTransferMessage) {}

  async handleTransactionCardCreation(message: TransactionCardCreationMessage) {}

  async handleTransactionCardTopup(message: TransactionCardTopupMessage) {}

  async handleTransactionCardWithdrawal(message: TransactionCardWithdrawalMessage) {}

  async handleBridgecardCreate(message: BridgecardCreateMessage) {
    // Create Bridgecard
    const bridgecardId = await this.bridgecardService.createCard({
      userId: message.userId,
      cardholderId: message.cardholderId,
      cardUuid: message.cardUuid,
      type: message.type,
      brand: message.brand,
      currency: message.currency,
      cardName: message.cardName,
    });

    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Create a transaction
      const transaction = await queryRunner.manager.save(
        await this.transactionService.create({
          userId: message.userId,
          currency: message.currency,
          cardPrice: message.cardPrice,
          appliedFee: message.appliedFee,
          affectedAmount: -message.totalToPay,
          fixedFee: message.fixedFee,
          percentFee: message.percentFee,
          cardId: message.cardId,
          type: TransactionTypeEnum.CardCreation,
          status: TransactionStatusEnum.InProgress, // Should be set to PENDING and update by webhook
          description: `Created a card "${message.cardName}" and topped up ${message.topupAmount} ${message.currency}`,
        }),
      );

      // Topup Bridgecard
      await this.bridgecardService.fundCard({
        card_id: bridgecardId,
        amount: message.topupAmount,
        transaction_reference: transaction.uuid,
        currency: message.currency,
      });

      // Update transaction status
      await queryRunner.manager.update(Transaction, transaction.id, {
        status: TransactionStatusEnum.Performed,
      });
      const updatedTransaction = await queryRunner.manager.findOneBy(Transaction, {
        id: transaction.id,
      });

      // Produce another message for notification
      const payload = new TransactionCardCreationMessage({
        transaction: updatedTransaction,
      });
      this.outboxService.create(queryRunner, TransactionEventPattern.CardCreation, payload);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async handleBridgecardFreeze(message: BridgecardFreezeMessage) {
    return this.bridgecardService.freezeCard(message.bridgecardId);
  }

  async handleBridgecardUnfreeze(message: BridgecardUnfreezeMessage) {
    return this.bridgecardService.unfreezeCard(message.bridgecardId);
  }
}
