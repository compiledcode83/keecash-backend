import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { FiatCurrencyEnum } from '@app/common';
import { TripleAService } from '@app/triple-a';
import {
  Transaction,
  TransactionEventPattern,
  TransactionService,
  TransactionStatusEnum,
  TransactionWalletDepositMessage,
  TransactionWalletWithdrawalMessage,
} from '@app/transaction';
import { OutboxService } from '@app/outbox';
import { TripleAWithdrawalNotifyDto } from './dto/triple-a-withdrawal-notify.dto';
import { TripleADepositNotifyDto } from './dto/triple-a-deposit-notify.dto';

@Injectable()
export class TripleAWebhookService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly tripleAService: TripleAService,
    private readonly transactionService: TransactionService,
    private readonly outboxService: OutboxService,
  ) {}

  async handleDepositNotification(body: TripleADepositNotifyDto) {
    // // Check transaction status by another API call
    // const details = await this.tripleAService.getDepositDetails(
    //   body.payment_reference,
    //   body.order_currency as FiatCurrencyEnum,
    // );

    // Possible status: 'done', 'short', 'hold', 'good', 'invalid'
    // See https://developers.triple-a.io/docs/triplea-api-doc/96532c880a416-webhook-notifications
    const transactionSucceeded = body.status === 'done';
    // const transactionSucceeded = details.status === 'done'

    if (transactionSucceeded) {
      const queryRunner = this.dataSource.createQueryRunner();

      try {
        await queryRunner.connect();
        await queryRunner.startTransaction();

        // Update IN PROGRESS transaction's status to 'PERFORMED'
        await queryRunner.manager.update(
          Transaction,
          { tripleAPaymentReference: body.payment_reference },
          { status: TransactionStatusEnum.Performed },
        );
        const updatedTransaction = await queryRunner.manager.findOneBy(Transaction, {
          tripleAPaymentReference: body.payment_reference,
        });

        const payload = new TransactionWalletDepositMessage({
          transaction: updatedTransaction,
        });
        this.outboxService.create(queryRunner, TransactionEventPattern.WalletDeposit, payload);

        await queryRunner.commitTransaction();
      } catch (err) {
        await queryRunner.rollbackTransaction();

        throw err;
      } finally {
        await queryRunner.release();
      }
    } else {
      // TODO: Update specific status options: 'hold', 'invalid'
      // Update IN PROGRESS transaction's status to 'REJECTED'
      await this.transactionService.update(
        { tripleAPaymentReference: body.payment_reference },
        {
          status: TransactionStatusEnum.Rejected,
        },
      );
    }
  }

  async handleWithdrawalNotification(body: TripleAWithdrawalNotifyDto) {
    // Check transaction status by another API call
    const details = await this.tripleAService.getWithdrawalDetails(
      body.payout_reference,
      body.local_currency,
    );

    // details.status : 'new', 'confirm', 'done', 'cancel'. See https://developers.triple-a.io/docs/triplea-api-doc/a6c4376384c1e-3-get-payout-details-by-order-id
    // const transactionSucceeded = body.status === 'done';
    // const transactionSucceeded = details.status === 'done'

    if (details.status === 'done') {
      const queryRunner = this.dataSource.createQueryRunner();

      try {
        await queryRunner.connect();
        await queryRunner.startTransaction();

        await queryRunner.manager.update(
          Transaction,
          { tripleAPaymentReference: body.payout_reference },
          { status: TransactionStatusEnum.Performed },
        );
        const updatedTransaction = await queryRunner.manager.findOneBy(Transaction, {
          tripleAPaymentReference: body.payout_reference,
        });

        const payload = new TransactionWalletWithdrawalMessage({
          transaction: updatedTransaction,
        });
        this.outboxService.create(queryRunner, TransactionEventPattern.WalletWithdrawal, payload);

        await queryRunner.commitTransaction();
      } catch (err) {
        await queryRunner.rollbackTransaction();

        throw err;
      } finally {
        await queryRunner.release();
      }
    } else {
      // TODO: Update specific status options: 'hold', 'invalid'
      // Update IN PROGRESS transaction's status to 'REJECTED'
      await this.transactionService.update(
        { tripleAPaymentReference: body.payout_reference },
        { status: TransactionStatusEnum.Rejected },
      );
    }
  }
}
