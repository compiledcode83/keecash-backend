import { Injectable } from '@nestjs/common';
import { FiatCurrencyEnum } from '@app/common';
import { TripleAService } from '@app/triple-a';
import { UserService } from '@app/user';
import { TransactionService, TransactionStatusEnum, TransactionTypeEnum } from '@app/transaction';
import { PricingService } from '@app/pricing';
import { TripleAWithdrawalNotifyDto } from './dto/triple-a-withdrawal-notify.dto';
import { TripleADepositNotifyDto } from './dto/triple-a-deposit-notify.dto';

@Injectable()
export class TripleAWebhookService {
  constructor(
    private readonly tripleAService: TripleAService,
    private readonly userService: UserService,
    private readonly transactionService: TransactionService,
    private readonly pricingService: PricingService,
  ) {}

  async handleDepositNotification(body: TripleADepositNotifyDto) {
    const details = await this.tripleAService.getDepositDetails(
      body.payment_reference,
      body.order_currency as FiatCurrencyEnum,
    );

    if (details.status === 'done') {
      const keecashId = details.payer_id.split('+')[1]; // payer_id looks like 'keecash+SV08DV8'

      const receiver = await this.userService.findOne({ referralId: keecashId });

      // Update IN PROGRESS transaction's status to 'PERFORMED'
      await this.transactionService.update(
        {
          tripleAPaymentReference: body.payment_reference,
          type: TransactionTypeEnum.Deposit,
          status: TransactionStatusEnum.InProgress,
        },
        { status: TransactionStatusEnum.Performed },
      );

      const referralUser = await this.userService.getReferralUser(receiver.id);

      if (referralUser) {
        const { fixedFee, percentFee } = await this.pricingService.findReferralFee({
          countryId: receiver.countryId,
        });

        await this.transactionService.create({
          receiverId: referralUser.id,
          appliedFee: parseFloat(((details.order_amount * percentFee) / 100 + fixedFee).toFixed(2)), // TODO: Check with Hol to define the fee
          fixedFee,
          percentFee: percentFee,
          type: TransactionTypeEnum.ReferralFee,
          currency: body.order_currency,
          tripleAPaymentReference: details.payment_reference,
          status: TransactionStatusEnum.Performed,
          description: `Referral fee from ${receiver.referralId}'s deposit`,
        });
      } else {
        // TODO: Update specific status options: 'hold', 'invalid'
        // Update IN PROGRESS transaction's status to 'REJECTED'
        await this.transactionService.update(body.webhook_data.keecash_tx_id, {
          status: TransactionStatusEnum.Rejected,
        });
      }
    }
  }

  async handleWithdrawalNotification(body: TripleAWithdrawalNotifyDto) {
    const details = await this.tripleAService.getWithdrawalDetails(
      body.payout_reference,
      body.local_currency,
    );

    // details.status : 'new', 'confirm', 'done', 'cancel'. See https://developers.triple-a.io/docs/triplea-api-doc/a6c4376384c1e-3-get-payout-details-by-order-id
    if (details.status === 'done') {
      // const { senderId } = await this.transactionService.findOne({
      //   tripleAPaymentReference: body.payout_reference,
      //   type: TransactionTypeEnum.Withdrawal,
      //   status: TransactionStatusEnum.InProgress
      // });

      // const referralUser = await this.userService.getReferralUser(senderId);

      await this.transactionService.update(
        {
          tripleAPaymentReference: body.payout_reference,
          type: TransactionTypeEnum.Withdrawal,
          status: TransactionStatusEnum.InProgress,
        },
        {
          status: TransactionStatusEnum.Performed,
        },
      );
    }
  }
}
