import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { DataSource } from 'typeorm';
import { TripleAService } from '@app/triple-a';
import {
  BridgecardEventPattern,
  BridgecardFreezeMessage,
  BridgecardCreateMessage,
  BridgecardService,
  BridgecardUnfreezeMessage,
} from '@app/bridgecard';
import { TransactionTypeEnum, TransactionStatusEnum } from '@app/transaction';
import { CardBrandEnum, CardTypeEnum, CardUsageEnum } from '@app/card';
import { PricingService } from '@app/pricing';
import { NotificationType } from '@app/notification';
import { FiatCurrencyEnum } from '@app/common';
import { OutboxService } from '@app/outbox';
import { TransactionService } from '@api/transaction/transaction.service';
import { UserService } from '@api/user/user.service';
import { TripleADepositNotifyDto } from '@api/keecash/dto/triple-a-deposit-notify.dto';
import { NotificationService } from '@api/notification/notification.service';
import { BeneficiaryService } from '@api/beneficiary/beneficiary.service';
import { CardService } from '@api/card/card.service';
import { UserAccessTokenInterface } from '@api/auth/auth.type';
import { GetDepositFeeDto } from './dto/get-deposit-fee.dto';
import { GetWithdrawalFeeDto } from './dto/get-withdrawal-fee.dto';
import { GetTransferFeeDto } from './dto/get-transfer-fee.dto';
import { GetCreateCardTotalFeeDto } from './dto/get-create-card-total-fee.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { GetCardTopupSettingDto } from './dto/get-card-topup-setting.dto';
import { WithdrawalApplyDto } from './dto/withdrawal-apply.dto';
import { DepositPaymentLinkDto } from './dto/deposit-payment-link.dto';
import { TransferApplyDto } from './dto/transfer-apply.dto';
import { GetWalletTransactionsQueryDto } from './dto/get-wallet-transactions.query.dto';
import { ApplyCardTopupDto } from './dto/card-topup-apply.dto';
import { GetCardWithdrawalSettingDto } from './dto/get-card-withdrawal-setting.dto';
import { ApplyCardWithdrawalDto } from './dto/card-withdrawal-apply.dto';
import { TripleAWithdrawalNotifyDto } from './dto/triple-a-withdrawal-notify.dto';
import { ManageCardDto } from './dto/manage-card.dto';
import { GetCreateCardSettingsDto } from './dto/get-create-card-settings.dto';

@Injectable()
export class KeecashService {
  private readonly logger = new Logger(BridgecardService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    private readonly cardService: CardService,
    private readonly transactionService: TransactionService,
    private readonly bridgecardService: BridgecardService,
    private readonly beneficiaryService: BeneficiaryService,
    private readonly notificationService: NotificationService,
    private readonly tripleAService: TripleAService,
    private readonly pricingService: PricingService,
    private readonly outboxService: OutboxService,
  ) {}

  // -------------- MANAGE CARD -------------------

  async getDashboardItemsByUserUuid(userUuid: string): Promise<any> {
    const {
      id: userId,
      cardholderId,
      cardholderVerified,
    } = await this.userService.findByUuid(userUuid);

    const walletBalance = await this.transactionService.getWalletBalances(userId);

    const transactions = await this.transactionService
      .findManyByFilter(userId, null, {})
      .then((res) =>
        res.map((tx) => ({
          amount: Math.abs(tx.affectedAmount),
          currency: tx.currency,
          date: tx.createdAt,
          to: '',
          type: tx.affectedAmount > 0 ? 'income' : 'outgoing',
        })),
      );

    let eurCards = [];
    let usdCards = [];

    if (cardholderId && cardholderVerified) {
      const cards = await this.bridgecardService.getAllCardholderCards(cardholderId);

      eurCards = cards
        .filter(({ card_currency }) => card_currency === FiatCurrencyEnum.EUR)
        .map((card) => ({
          cardId: card.meta_data.keecash_card_uuid,
          balance: card.balance,
          currency: card.card_currency,
          cardNumber: card.card_number,
          name: card.meta_data.keecash_card_name,
          date: {
            expiry_month: card.expiry_month,
            expiry_year: card.expiry_year,
          },
        }));
      usdCards = cards
        .filter(({ card_currency }) => card_currency === FiatCurrencyEnum.USD)
        .map((card) => ({
          cardId: card.meta_data.keecash_card_uuid,
          balance: card.balance,
          currency: card.card_currency,
          cardNumber: card.card_number,
          name: card.meta_data.keecash_card_name,
          date: `${card.expiry_month < 10 && '0' + card.expiry_month}/${card.expiry_year.slice(
            -2,
          )}`,
        }));
    }

    return {
      wallets: [
        {
          balance: walletBalance.eur,
          currency: FiatCurrencyEnum.EUR,
          cards: eurCards,
        },
        {
          balance: walletBalance.usd,
          currency: FiatCurrencyEnum.USD,
          cards: usdCards,
        },
      ],
      recommended: FiatCurrencyEnum.EUR,
      transactions,
    };
  }

  async getCardListByUserUuid(userUuid: string): Promise<any> {
    const { cardholderId } = await this.userService.findByUuid(userUuid);

    const cards = await this.bridgecardService.getAllCardholderCards(cardholderId);

    const details = await Promise.all(
      cards.map(async (card) => {
        const balancePromise = this.bridgecardService.getCardBalance(card.card_id);
        const transactionsPromise = this.bridgecardService.getCardTransactions(card.card_id);
        const keecashCardPromise = this.cardService.findOne({ bridgecardId: card.card_id });

        const [balance, transactions, keecashCard] = await Promise.all([
          balancePromise,
          transactionsPromise,
          keecashCardPromise,
        ]);

        return {
          balance,
          isBlockByAdmin: keecashCard.isBlocked,
          lastTransaction: transactions.transactions && {
            amount: transactions.transactions[0].amount,
            date: transactions.transactions[0].transaction_date, //2022-08-08 02:48:15
            image: '',
            to: transactions.transactions[0].description,
            type: '',
            currency: transactions.transactions[0].currency,
            from: '',
          },
        };
      }),
    );

    const result = cards.map((card, i) => ({
      cardId: card.meta_data.keecash_card_uuid,
      balance: details[i].balance,
      currency: card.card_currency,
      isBlock: !card.is_active,
      isBlockByAdmin: details[i].isBlockByAdmin,
      isExpired: new Date(`${card.expiry_year}-${card.expiry_month}-01`) < new Date(),
      cardNumber: card.card_number,
      name: card.meta_data.keecash_card_name,
      date: `${card.expiry_month}/${card.expiry_year.slice(-2)}`,
      cardholderName: card.card_name,
      lastTransaction: details[i].lastTransaction,
    }));

    return result;
  }

  async blockCard(body: ManageCardDto): Promise<void> {
    const { id: userId } = await this.userService.findByUuid(body.user.uuid);
    const card = await this.cardService.findOne({ userId, uuid: body.cardId });
    if (!card) {
      throw new UnauthorizedException('Cannot find card with requested uuid');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const payload = new BridgecardFreezeMessage({
        bridgecardId: card.bridgecardId,
      });

      await this.outboxService.create(
        queryRunner,
        BridgecardEventPattern.BridgecardFreeze,
        payload,
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async unlockCard(body: ManageCardDto): Promise<void> {
    const { id: userId } = await this.userService.findByUuid(body.user.uuid);
    const card = await this.cardService.findOne({ userId, uuid: body.cardId });
    if (!card) {
      throw new UnauthorizedException('User does not have right to access the card');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const payload = new BridgecardUnfreezeMessage({
        bridgecardId: card.bridgecardId,
      });

      await this.outboxService.create(
        queryRunner,
        BridgecardEventPattern.BridgecardUnfreeze,
        payload,
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async removeCard(body: ManageCardDto): Promise<void> {
    const { id: userId } = await this.userService.findByUuid(body.user.uuid);

    await this.cardService.delete({ userId, uuid: body.cardId });
  }

  // -------------- DEPOSIT -------------------

  async getDepositFee(countryId: number, query: GetDepositFeeDto) {
    const { fixedFee, percentFee } = await this.pricingService.findWalletDepositFee({
      countryId,
      currency: query.keecash_wallet,
      method: query.deposit_method,
    });

    const feesApplied = parseFloat(
      ((parseFloat(query.fiat_amount) * percentFee) / 100 + fixedFee).toFixed(2),
    );
    const amountAfterFee = parseFloat(query.fiat_amount) + feesApplied;

    return {
      fix_fees: fixedFee,
      percent_fees: percentFee,
      fees_applied: feesApplied,
      amount_after_fee: amountAfterFee,
    };
  }

  async getDepositPaymentLink(user: UserAccessTokenInterface, body: DepositPaymentLinkDto) {
    const {
      id: userId,
      countryId,
      email,
      referralId,
    } = await this.userService.findByUuid(user.uuid);

    // Calculate fees
    const { fixedFee, percentFee } = await this.pricingService.findWalletDepositFee({
      countryId: countryId,
      currency: body.keecash_wallet,
      method: body.deposit_method,
    });
    const feesApplied = parseFloat(
      ((body.desired_amount * percentFee) / 100 + fixedFee).toFixed(2),
    );
    const amountAfterFee = body.desired_amount + feesApplied;

    // Trigger TripleA API
    const res = await this.tripleAService.deposit({
      amount: amountAfterFee,
      currency: body.keecash_wallet,
      email: email,
      keecashUserId: referralId,
    });

    // Create a deposit transaction
    await this.transactionService.create({
      userId,
      currency: body.keecash_wallet,
      affectedAmount: body.desired_amount,
      appliedFee: feesApplied,
      fixedFee: fixedFee,
      percentFee: percentFee,
      cryptoType: body.deposit_method,
      type: TransactionTypeEnum.Deposit,
      status: TransactionStatusEnum.InProgress, // TODO: set PERFORMED after webhook call
      description: `Deposited ${body.desired_amount} ${body.keecash_wallet} from ${body.deposit_method}`,
      reason: body.reason,
      tripleAPaymentReference: res.payment_reference,
    });

    // TODO: Add to Redis/BullMQ message queue asynchronously
    // Create a notification for the transaction
    await this.notificationService.create({
      userId,
      type: NotificationType.Deposit,
      amount: body.desired_amount,
      currency: body.keecash_wallet,
    });

    return {
      link: res.hosted_url,
    };
  }

  // -------------- WITHDRAWAL -------------------

  async getWithdrawalFee(countryId: number, query: GetWithdrawalFeeDto) {
    const { fixedFee, percentFee } = await this.pricingService.findWalletWithdrawalFee({
      countryId,
      currency: query.keecash_wallet,
      method: query.withdrawal_method,
    });

    const feesApplied = parseFloat(((query.fiat_amount * percentFee) / 100 + fixedFee).toFixed(2));
    const amountAfterFee = query.fiat_amount - feesApplied;

    return {
      fix_fees: fixedFee,
      percent_fees: percentFee,
      fees_applied: feesApplied,
      amount_after_fee: amountAfterFee,
    };
  }

  async applyWithdrawal(user: UserAccessTokenInterface, body: WithdrawalApplyDto) {
    const { id: userId } = await this.userService.findByUuid(user.uuid);

    // Check if user has enough balance
    const { balance } = await this.transactionService.getBalanceArrayByCurrency(
      userId,
      body.keecash_wallet,
    );
    if (balance < body.target_amount) {
      throw new BadRequestException('Total pay amount exceeds current wallet balance');
    }

    // Add beneficiary user wallet
    if (body.to_save_as_beneficiary) {
      await this.beneficiaryService.createBeneficiaryWallet({
        userId,
        address: body.wallet_address,
        name: body.wallet_name,
        type: body.withdrawal_method,
      });
    }

    // Calculate fees
    const { fixedFee, percentFee } = await this.pricingService.findWalletWithdrawalFee({
      countryId: user.countryId,
      currency: body.keecash_wallet,
      method: body.withdrawal_method,
    });
    const feesApplied = parseFloat(((body.target_amount * percentFee) / 100 + fixedFee).toFixed(2));
    const amountAfterFee = body.target_amount - feesApplied;

    // Trigger TripleA API
    const res = await this.tripleAService.withdraw({
      email: user.email,
      amount: amountAfterFee,
      cryptocurrency: body.withdrawal_method,
      currency: body.keecash_wallet,
      walletAddress: body.wallet_address,
      name: 'Keecash',
      country: 'FR',
      keecashUserId: user.referralId,
    });

    // Create a withdrawal transaction in database
    await this.transactionService.create({
      userId,
      currency: body.keecash_wallet,
      affectedAmount: -body.target_amount,
      appliedFee: feesApplied,
      fixedFee: fixedFee,
      percentFee: percentFee,
      cryptoType: body.withdrawal_method,
      type: TransactionTypeEnum.Withdrawal,
      status: TransactionStatusEnum.InProgress, // TODO: set PERFORMED after webhook call
      reason: body.reason,
      tripleAPaymentReference: res.payout_reference,
    });

    // TODO: Add to BullMQ
    // Create a notification for the transaction
    await this.notificationService.create({
      userId,
      type: NotificationType.Withdrawal,
      amount: body.target_amount,
      currency: body.keecash_wallet,
    });
  }

  // -------------- TRANSFER -------------------

  async getTransferFee(countryId: number, query: GetTransferFeeDto) {
    const { fixedFee, percentFee } = await this.pricingService.findTransferFee({
      countryId,
      currency: query.keecash_wallet,
    });

    const feesApplied = parseFloat(
      ((parseFloat(query.desired_amount) * percentFee) / 100 + fixedFee).toFixed(2),
    );
    const amountAfterFee = parseFloat(query.desired_amount) - feesApplied;

    return {
      fix_fees: fixedFee,
      percent_fees: percentFee,
      fees_applied: feesApplied,
      amount_to_receive: amountAfterFee,
    };
  }

  async applyTransfer(userId: number, countryId: number, body: TransferApplyDto) {
    // Check if user has enough balance
    const { balance } = await this.transactionService.getBalanceArrayByCurrency(
      userId,
      body.keecash_wallet,
    );
    if (balance < body.desired_amount) {
      throw new BadRequestException('Requested transfer amount exceeds current wallet balance');
    }

    // Calculate fees
    const { fixedFee, percentFee } = await this.pricingService.findTransferFee({
      countryId,
      currency: body.keecash_wallet,
    });
    const feesApplied = parseFloat(
      ((body.desired_amount * percentFee) / 100 + fixedFee).toFixed(2),
    );
    const amountAfterFee = body.desired_amount - feesApplied;

    // Create 2 database transaction records for both sender and receiver
    await this.transactionService.createMany([
      {
        userId,
        receiverId: body.beneficiary_user_id,
        currency: body.keecash_wallet,
        affectedAmount: -body.desired_amount,
        appliedFee: feesApplied,
        fixedFee: fixedFee,
        percentFee: percentFee,
        type: TransactionTypeEnum.Transfer,
        status: TransactionStatusEnum.Performed, // TODO: Consider pending status in this transaction.
        description: `Transferred ${body.desired_amount} ${body.keecash_wallet}`,
        reason: body.reason,
      },
      {
        userId: body.beneficiary_user_id,
        senderId: userId,
        currency: body.keecash_wallet,
        affectedAmount: amountAfterFee,
        appliedFee: feesApplied,
        fixedFee: fixedFee,
        percentFee: percentFee,
        type: TransactionTypeEnum.Transfer,
        status: TransactionStatusEnum.Performed, // TODO: Consider pending status in this transaction.
        description: `Received ${amountAfterFee} ${body.keecash_wallet}`,
        reason: body.reason,
      },
    ]);

    // Add beneficiary user
    if (body.to_save_as_beneficiary) {
      await this.beneficiaryService.createBeneficiaryUser({
        payerId: userId,
        payeeId: body.beneficiary_user_id,
      });
    }

    // TODO: Add to BullMQ
    // Create notifications for the transaction
    await this.notificationService.create([
      {
        userId: userId,
        type: NotificationType.TransferSent,
        amount: body.desired_amount,
        currency: body.keecash_wallet,
      },
      {
        userId: body.beneficiary_user_id,
        type: NotificationType.TransferReceived,
        amount: body.desired_amount,
        currency: body.keecash_wallet,
      },
    ]);
  }

  // -------------- HISTORY -------------------

  async getWalletTransactions(
    userUuid: string,
    currency: FiatCurrencyEnum,
    query: GetWalletTransactionsQueryDto,
  ) {
    const { id: userId } = await this.userService.findByUuid(userUuid);

    const transactions = await this.transactionService.findManyByFilter(userId, currency, query);

    return transactions;
  }

  // -------------- CREATE CARD -------------------

  async getCreateCardSettings(query: GetCreateCardSettingsDto) {
    const cardPrices = await this.pricingService.findAllCardPrices({
      type: CardTypeEnum.Virtual, // Bridgecard provides VIRTUAL cards only
      countryId: query.user.countryId,
      currency: query.currency,
    });

    const multipleCardPrice = cardPrices.find((price) => price.usage === CardUsageEnum.Multiple);
    const uniqueCardPrice = cardPrices.find((price) => price.usage === CardUsageEnum.Unique);

    if (!multipleCardPrice || !uniqueCardPrice) {
      throw new NotFoundException('Cannot find card prices for requested country');
    }

    const cardTypes = [
      {
        name: 'Multiple use card',
        type: CardUsageEnum.Multiple,
        description: 'Topped up multiple time',
        is_checked: true,
        price: multipleCardPrice.price,
        currency: query.currency,
        cardValidity: '2 years',
      },
      {
        name: 'Single use card',
        type: CardUsageEnum.Unique,
        description: 'Topped up one time',
        is_checked: false,
        price: uniqueCardPrice.price,
        currency: query.currency,
        cardValidity: '2 years',
      },
    ];

    return {
      cardTypes,
    };
  }

  async getFeesAppliedTotalToPay(query: GetCreateCardTotalFeeDto) {
    const { countryId } = await this.userService.findByUuid(query.user.uuid);

    const { percentFee, fixedFee } = await this.pricingService.findCardTopupFee({
      countryId,
      currency: query.currency,
      usage: query.cardUsageType,
    });

    const feesApplied = parseFloat(
      ((parseFloat(query.desiredAmount) * percentFee) / 100 + fixedFee).toFixed(2),
    );

    const { price: cardPrice } = await this.pricingService.findOneCardPrice({
      countryId,
      currency: query.currency,
      usage: query.cardUsageType,
      type: CardTypeEnum.Virtual, // Bridgecard provides VIRTUAL cards only
    });

    const totalToPay = cardPrice + parseFloat(query.desiredAmount) + feesApplied;

    return {
      fixedFee: fixedFee,
      percentFee: percentFee,
      feesApplied,
      cardPrice,
      totalToPay,
    };
  }

  async createCard(body: CreateCardDto) {
    const {
      id: userId,
      countryId,
      cardholderId,
      cardholderVerified,
    } = await this.userService.findByUuid(body.user.uuid);

    if (!cardholderId || !cardholderVerified) {
      throw new BadRequestException('User is not registered in Bridgecard provider');
    }

    // Calculate price
    const { price: cardPrice } = await this.pricingService.findOneCardPrice({
      countryId,
      currency: body.keecashWallet,
      type: body.cardType,
      usage: body.cardUsage,
    });
    const { fixedFee, percentFee } = await this.pricingService.findCardTopupFee({
      countryId,
      currency: body.keecashWallet,
      usage: body.cardUsage,
    });
    const targetAmount = body.topupAmount;
    const appliedFee = parseFloat((fixedFee + (targetAmount * percentFee) / 100).toFixed(2));
    const totalToPay = cardPrice + targetAmount + appliedFee;

    // Check if wallet balance is enough
    const { balance } = await this.transactionService.getBalanceArrayByCurrency(
      userId,
      body.keecashWallet,
    );
    if (balance < totalToPay) {
      throw new BadRequestException('Total pay amount exceeds current wallet balance');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const card = await queryRunner.manager.save(
        await this.cardService.create({
          userId,
          name: body.name,
          currency: body.keecashWallet,
          usage: body.cardUsage,
        }),
      );

      const payload = new BridgecardCreateMessage({
        userId,
        cardholderId,
        cardId: card.id,
        cardUuid: card.uuid,
        type: body.cardType,
        brand: CardBrandEnum.Visa, // default
        currency: body.keecashWallet,
        cardName: body.name,
        cardPrice,
        topupAmount: body.topupAmount,
        totalToPay,
        appliedFee,
        fixedFee,
        percentFee,
      });

      await this.outboxService.create(
        queryRunner,
        BridgecardEventPattern.BridgecardCreate,
        payload,
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // -------------- CARD TOPUP -------------------

  async getCardTopupSettings(user: UserAccessTokenInterface, query: GetCardTopupSettingDto) {
    const { id: userId } = await this.userService.findByUuid(user.uuid);

    const card = await this.cardService.findOne({
      userId,
      bridgecardId: query.bridgecardId,
    });

    if (!card) {
      throw new NotFoundException('Cannot find card with requested id');
    }

    const { fixedFee, percentFee } = await this.pricingService.findCardTopupFee({
      countryId: user.countryId,
      currency: card.currency,
      usage: card.usage,
    });

    const feesApplied = parseFloat(
      ((parseFloat(query.desiredAmount) * percentFee) / 100 + fixedFee).toFixed(2),
    );

    const totalToPay = parseFloat(query.desiredAmount) + feesApplied;

    return {
      fixedFee: fixedFee,
      percentFee: percentFee,
      feesApplied,
      totalToPay,
    };
  }

  async applyCardTopup(userId: number, countryId: number, body: ApplyCardTopupDto) {
    const { currency, usage } = await this.cardService.findOne({ bridgecardId: body.bridgecardId });

    const { fixedFee, percentFee } = await this.pricingService.findCardTopupFee({
      countryId,
      currency,
      usage,
    });

    const feesApplied = parseFloat(((body.topupAmount * percentFee) / 100 + fixedFee).toFixed(2));

    const totalToPay = body.topupAmount + feesApplied;

    const { balance } = await this.transactionService.getBalanceArrayByCurrency(userId, currency);

    if (balance < totalToPay) {
      throw new BadRequestException('Total pay amount exceeds current wallet balance');
    }

    // Deposit to card using Bridgecard provider
    await this.bridgecardService.fundCard({
      card_id: body.bridgecardId,
      amount: body.topupAmount * 100, // Amount in cents
      transaction_reference: uuid(),
      currency,
    });

    await this.transactionService.create({
      userId,
      currency,
      affectedAmount: -totalToPay,
      appliedFee: feesApplied,
      fixedFee: fixedFee,
      percentFee: percentFee,
      type: TransactionTypeEnum.CardTopup,
      status: TransactionStatusEnum.Performed,
      description: `Topup ${body.topupAmount} ${currency} to cardId ${body.bridgecardId}`,
    });

    // TODO: Add to BullMQ
    await this.notificationService.create({
      userId,
      type: NotificationType.CardTopup,
      amount: totalToPay,
      currency,
    });
  }

  // -------------- CARD TOPUP -------------------

  async getCardWithdrawalSettings(countryId: number, query: GetCardWithdrawalSettingDto) {
    const { currency } = await this.cardService.findOne({ bridgecardId: query.bridgecardId });

    const { fixedFee, percentFee } = await this.pricingService.findCardWithdrawalFee({
      countryId,
      currency,
    });

    const feesApplied = parseFloat(
      ((parseFloat(query.desiredAmount) * percentFee) / 100 + fixedFee).toFixed(2),
    );

    const totalToPay = parseFloat(query.desiredAmount) + feesApplied;

    return {
      fixedFee: fixedFee,
      percentFee: percentFee,
      feesApplied,
      totalToPay,
    };
  }

  async applyCardWithdrawal(userId: number, countryId: number, body: ApplyCardWithdrawalDto) {
    const { currency } = await this.cardService.findOne({ bridgecardId: body.bridgecardId });

    const { fixedFee, percentFee } = await this.pricingService.findCardWithdrawalFee({
      countryId,
      currency,
    });

    const feesApplied = parseFloat(
      ((body.withdrawalAmount * percentFee) / 100 + fixedFee).toFixed(2),
    );

    const totalToPay = body.withdrawalAmount + feesApplied;

    const { balance } = await this.transactionService.getBalanceArrayByCurrency(userId, currency);

    if (balance < totalToPay) {
      throw new BadRequestException('Total pay amount exceeds current wallet balance');
    }

    // Withdraw from card using Bridgecard provider
    await this.bridgecardService.unloadCard({
      card_id: body.bridgecardId,
      amount: totalToPay * 100, // Amount in cents
      transaction_reference: uuid(),
      currency,
    });

    await this.transactionService.create({
      userId,
      currency,
      affectedAmount: body.withdrawalAmount,
      appliedFee: feesApplied,
      fixedFee: fixedFee,
      percentFee: percentFee,
      type: TransactionTypeEnum.CardWithdrawal,
      status: TransactionStatusEnum.Performed,
      description: `Withdraw ${body.withdrawalAmount} ${currency} from cardId ${body.bridgecardId}`,
    });

    // TODO: Add to BullMQ
    await this.notificationService.create({
      userId,
      type: NotificationType.CardWithdrawal,
      amount: body.withdrawalAmount,
      currency,
    });
  }

  // ------------------ Bridgecard Webhook Handler ----------------------

  async handleBridgecardWebhookEvent(event: string, data: any) {
    switch (event) {
      case 'cardholder_verification.successful':
        await this.userService.update(
          { cardholderId: data.cardholder_id },
          { cardholderVerified: true },
        );
        this.logger.log(`Cardholder: ${data.cardholder_id} is verified successfully`);
        break;

      case 'cardholder_verification.failed':
        this.logger.log(`Verification failed for cardholder: ${data.cardholder_id}`);
        break;

      case 'card_creation_event.successful':
        const { id: userId } = await this.userService.findOne({ cardholderId: data.cardholder_id });
        // await this.cardService.create({
        //   userId: userId,
        //   bridgecardId: data.card_id,
        // });
        break;

      case 'card_creation_event.failed':
        break;

      case 'card_credit_event.successful':
        break;

      case 'card_credit_event.failed':
        break;

      case 'card_debit_event.successful':
        break;

      case 'card_debit_event.declined':
        break;

      case 'card_reversal_event.successful':
        break;

      case '3d_secure_otp_event.generated':
        break;

      default:
        break;
    }
  }

  // ------------------ TripleA Webhook Handler ----------------------

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
