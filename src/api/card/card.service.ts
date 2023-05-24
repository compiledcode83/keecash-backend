import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CardRepository } from './card.repository';
import { GetDepositFeeDto } from './dto/get-deposit-fee.dto';
import {
  FiatCurrencyEnum,
  TxTypeEnum,
  TransactionStatusEnum,
  CryptoCurrencyEnum,
} from '@api/transaction/transaction.types';
import { GetWithdrawalFeeDto } from './dto/get-withdrawal-fee.dto';
import { GetTransferFeeDto } from './dto/get-transfer-fee.dto';
import { TransactionService } from '@api/transaction/transaction.service';
import { GetCreateCardTotalFeeDto } from './dto/get-create-card-total-fee.dto';
import { Card } from './card.entity';
import { CountryFeeService } from '@api/country-fee/country-fee.service';
import { UserService } from '@api/user/user.service';
import { CreateCardDto } from './dto/create-card.dto';
import { BridgecardService } from '@api/bridgecard/bridgecard.service';
import { CardBrandEnum, CardTypeEnum, CardUsageEnum } from './card.types';
import { BeneficiaryService } from '@api/beneficiary/beneficiary.service';
import { GetCardTopupSettingDto } from './dto/get-card-topup-setting.dto';
import { TripleADepositNotifyDto } from '@api/triple-a/dto/triple-a-deposit-notify.dto';
import { TripleAWithdrawalNotifyDto } from '@api/triple-a/dto/triple-a-withdrawal-notify.dto';
import { UserAccessTokenInterface } from '@api/auth/auth.type';
import { WithdrawalApplyDto } from './dto/withdrawal-apply.dto';
import { NotificationService } from '@api/notification/notification.service';
import { TripleAService } from '@api/triple-a/triple-a.service';
import { DepositPaymentLinkDto } from './dto/deposit-payment-link.dto';
import { NotificationType } from '@api/notification/notification.types';
import { TransferApplyDto } from './dto/transfer-apply.dto';
import { GetWalletTransactionsQueryDto } from './dto/get-wallet-transactions.query.dto';
import { ApplyCardTopupDto } from './dto/card-topup-apply.dto';
import { GetCardWithdrawalSettingDto } from './dto/get-card-withdrawal-setting.dto';
import { ApplyCardWithdrawalDto } from './dto/card-withdrawal-apply.dto';
import { AuthService } from '@api/auth/auth.service';
import { CoinlayerService } from '@api/coinlayer/coinlayer.service';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { SendgridService } from '@api/sendgrid/sendgrid.service';
import { WebhookDepositResponseInterface } from './dto/webhook-deposit-response.interface';
import { GetTopupSettingQueryDto } from './dto/get-topup-setting-query.dto';
import { CardBrandQueryDto } from './dto/card-brand-query.dto';
import { ToolsHelper } from '@common/helpers/tools.helper';

@Injectable()
export class CardService {
  private readonly logger = new Logger(BridgecardService.name);

  constructor(
    private readonly cardRepository: CardRepository,
    private readonly transactionService: TransactionService,
    private readonly countryFeeService: CountryFeeService,
    private readonly bridgecardService: BridgecardService,
    private readonly beneficiaryService: BeneficiaryService,
    private readonly notificationService: NotificationService,
    private readonly tripleAService: TripleAService,
    private readonly authService: AuthService,
    private readonly coinlayerService: CoinlayerService,
    private readonly configService: ConfigService,
    private readonly sendgridService: SendgridService,
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
  ) {}

  async findOne(param: Partial<Card>) {
    return this.cardRepository.findOne({ where: param });
  }

  async findAllPaginated(searchParams: any): Promise<any> {
    return;
    // return this.getPaginatedQueryBuilder({ ...searchParams, userId });
  }

  async create(data: Partial<Card>) {
    const cardEntity = await this.cardRepository.create(data);

    return this.cardRepository.save(cardEntity);
  }

  async delete(param: Partial<Card>): Promise<boolean> {
    const { affected } = await this.cardRepository.softDelete(param);

    if (affected) return true;
    else return false;
  }

  // -------------- MANAGE CARD -------------------

  async getDashboardItemsByUserId(userId: number): Promise<any> {
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

    const { cardholderId, cardholderVerified } = await this.userService.findOne({ id: userId });

    let eurCards = [];
    let usdCards = [];

    if (cardholderId && cardholderVerified) {
      const cards = await this.bridgecardService.getAllCardholderCards(cardholderId);

      const balanceTab = { EUR: [], USD: [] };

      for (const cardHold of cards) {
        const balance = await this.bridgecardService.getCardBalance(cardHold.card_id);
        balanceTab[cardHold.card_currency].push(balance);
      }

      eurCards =
        cards.length === 0
          ? []
          : cards
              .filter(({ card_currency }) => card_currency === FiatCurrencyEnum.EUR)
              .map((card, i) => ({
                cardId: card.card_id,
                balance: balanceTab.EUR[i],
                currency: card.card_currency,
                cardNumber: card.card_number,
                name: card.meta_data ? card.meta_data.keecash_card_name : 'Unnamed',
                date: `${
                  Number(card.expiry_month) < 10 ? '0' + card.expiry_month : card.expiry_month
                }/${card.expiry_year.slice(-2)}`,
              }));
      usdCards =
        cards.length === 0
          ? []
          : cards
              .filter(({ card_currency }) => card_currency === FiatCurrencyEnum.USD)
              .map((card, i) => ({
                cardId: card.card_id,
                balance: balanceTab.USD[i],
                currency: card.card_currency,
                cardNumber: card.card_number,
                name: card.meta_data ? card.meta_data.keecash_card_name : 'Unnamed',
                date: `${
                  Number(card.expiry_month) < 10 ? '0' + card.expiry_month : card.expiry_month
                }/${card.expiry_year.slice(-2)}`,
              }));
    }

    return {
      isSuccess: true,
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

  async getCardListByUserId(userId: number): Promise<any> {
    const { cardholderId, lastName, firstName } = await this.userService.findOne({ id: userId });

    const cards = await this.bridgecardService.getAllCardholderCards(cardholderId);

    const details = await Promise.all(
      cards.map(async (card) => {
        const balancePromise = this.bridgecardService.getCardBalance(card.card_id);
        const transactionsPromise = this.bridgecardService.getCardTransactions(card.card_id);
        const keecashCardPromise = this.cardRepository.findOne({
          where: { bridgecardId: card.card_id },
        });

        const [balance, transactions, keecashCard] = await Promise.all([
          balancePromise,
          transactionsPromise,
          keecashCardPromise,
        ]);

        return {
          balance,
          isBlockByAdmin: keecashCard ? keecashCard.isBlocked ?? false : false,
          lastTransaction: transactions.transactions && {
            amount: transactions.transactions[0].amount,
            date: transactions.transactions[0].transaction_date, //2022-08-08 02:48:15
            image: ToolsHelper.getImageTransaction(transactions.transactions[0].description),
            to: transactions.transactions[0].description,
            type:
              transactions.transactions[0].card_transaction_type === 'DEBIT'
                ? 'outgoing'
                : 'income',
            currency: transactions.transactions[0].currency === 'USD' ? '€' : '$',
            from: card.card_name,
          },
        };
      }),
    );

    const result = cards.map((card, i) => ({
      cardId: card.card_id,
      balance: details[i].balance,
      currency: card.card_currency,
      isBlock: !card.is_active,
      isBlockByAdmin: details[i].isBlockByAdmin,
      isExpired: new Date(`${card.expiry_year}-${card.expiry_month}-01`) < new Date(),
      cardNumber: card.card_number,
      name: card.meta_data ? card.meta_data.keecash_card_name : 'Unnamed',
      date: `${card.expiry_month}/${card.expiry_year.slice(-2)}`,
      holderLastName: lastName,
      holderFirstName: firstName,
      cardholderName: card.card_name,
      lastTransaction: details[i].lastTransaction,
    }));

    return result;
  }

  async blockCard(userId: number, cardId: string): Promise<void> {
    const card = this.cardRepository.findOne({ where: { userId, bridgecardId: cardId } });

    if (!card) {
      throw new UnauthorizedException('Cannot find card with requested ID');
    }

    await this.bridgecardService.freezeCard(cardId);
  }

  async unlockCard(userId: number, cardId: string): Promise<void> {
    const card = this.cardRepository.findOne({ where: { userId, bridgecardId: cardId } });

    if (!card) {
      throw new UnauthorizedException('User does not have right to access the card');
    }

    await this.bridgecardService.unfreezeCard(cardId);
  }

  // -------------- DEPOSIT -------------------

  async getDepositOrWithdrawalSettings(
    countryId: number,
    userId: number,
    type: 'Deposit' | 'Withdrawal',
  ) {
    const walletBalance = await this.transactionService.getWalletBalances(userId);

    const exchangeRates = await this.coinlayerService.getExchangeRate();

    //TODO:Take min,max, after_decimal, activation from the DB according to method

    const methods = [
      {
        name: 'Bitcoin',
        code: 'BTC',
        is_checked: false,
        data: {
          EUR: {
            is_active: true,
            inactive_message: '',
            min: 0,
            max: 0,
            after_decimal: 6,
            exchange_rate: exchangeRates.EUR.BTC,
          },
          USD: {
            is_active: true,
            inactive_message: '',
            min: 0,
            max: 0,
            after_decimal: 6,
            exchange_rate: exchangeRates.USD.BTC,
          },
        },
      },
      {
        name: 'Bitcoin Lightning',
        code: 'BTC_LIGHTNING',
        is_checked: false,
        data: {
          EUR: {
            //EUR
            is_active: true,
            inactive_message: '',
            min: 0,
            max: 0,
            after_decimal: 6,
            exchange_rate: exchangeRates.EUR.BTC,
          },
          USD: {
            is_active: true,
            inactive_message: '',
            min: 0,
            max: 0,
            after_decimal: 6,
            exchange_rate: exchangeRates.USD.BTC,
          },
        },
      },
      {
        name: 'Ethereum',
        code: 'ETH',
        is_checked: false,
        data: {
          EUR: {
            is_active: true,
            inactive_message: '',
            min: 0,
            max: 0,
            after_decimal: 4,
            exchange_rate: exchangeRates.EUR.ETH,
          },
          USD: {
            //USD
            is_active: true,
            inactive_message: '',
            min: 0,
            max: 0,
            after_decimal: 4,
            exchange_rate: exchangeRates.USD.ETH,
          },
        },
      },
      {
        name: 'Tether USD (TRC20)',
        code: 'USDT_TRC20',
        is_checked: false,
        data: {
          EUR: {
            is_active: true,
            inactive_message: '',
            min: 0,
            max: 0,
            after_decimal: 2,
            exchange_rate: exchangeRates.EUR.USDT,
          },
          USD: {
            is_active: true,
            inactive_message: '',
            min: 0,
            max: 0,
            after_decimal: 2,
            exchange_rate: exchangeRates.USD.USDT,
          },
        },
      },
      {
        name: 'Tether USD (ERC20)',
        code: 'USDT_ERC20',
        is_checked: false,
        data: {
          EUR: {
            is_active: true,
            inactive_message: '',
            min: 0,
            max: 0,
            after_decimal: 2,
            exchange_rate: exchangeRates.EUR.USDT,
          },
          USD: {
            is_active: true,
            inactive_message: '',
            min: 0,
            max: 0,
            after_decimal: 2,
            exchange_rate: exchangeRates.USD.USDT,
          },
        },
      },
      {
        name: 'USD Coin',
        code: 'USDC',
        is_checked: false,
        data: {
          EUR: {
            is_active: true,
            inactive_message: '',
            min: 0,
            max: 0,
            after_decimal: 2,
            exchange_rate: exchangeRates.EUR.USDT,
          },
          USD: {
            //USD
            is_active: true,
            inactive_message: '',
            min: 0,
            max: 0,
            after_decimal: 2,
            exchange_rate: exchangeRates.USD.USDT,
          },
        },
      },
      {
        name: 'Binance Pay',
        code: 'BINANCE',
        is_checked: false,
        data: {
          EUR: {
            is_active: true,
            inactive_message: '',
            min: 0,
            max: 0,
            after_decimal: 2,
            exchange_rate: exchangeRates.EUR.USDT,
          },
          USD: {
            is_active: true,
            inactive_message: '',
            min: 0,
            max: 0,
            after_decimal: 2,
            exchange_rate: exchangeRates.USD.USDT,
          },
        },
      },
    ];

    const keecash_wallets = [
      {
        currency: 'EUR',
        balance: walletBalance.eur,
        is_checked: true, // the first element always true
        after_decimal: 2,
        min: {
          BTC: 0,
          BTC_LIGHTNING: 0,
          ETH: 0,
          USDT_TRC20: 0,
          USDT_ERC20: 0,
          USDC: 0,
          BINANCE: 0,
        },
        max: {
          BTC: 0,
          BTC_LIGHTNING: 0,
          ETH: 0,
          USDT_TRC20: 0,
          USDT_ERC20: 0,
          USDC: 0,
          BINANCE: 0,
        },
      },
      {
        currency: 'USD',
        balance: walletBalance.usd,
        is_checked: false,
        after_decimal: 2,
        min: {
          BTC: 0,
          BTC_LIGHTNING: 0,
          ETH: 0,
          USDT_TRC20: 0,
          USDT_ERC20: 0,
          USDC: 0,
          BINANCE: 0,
        },
        max: {
          BTC: 0,
          BTC_LIGHTNING: 0,
          ETH: 0,
          USDT_TRC20: 0,
          USDT_ERC20: 0,
          USDC: 0,
          BINANCE: 0,
        },
      },
    ];

    //we need this to convert fiat → crypto ↔ crypto = fiat/exchangeRates
    const convertFiat2Crypto = (fiat, rate, after_decimal) => {
      return parseFloat((fiat / rate).toFixed(after_decimal));
    };

    //populate value min max on deposit_methods & keecash_wallets
    for (const [i, method] of methods.entries()) {
      for (const currency of Object.keys(method.data) as FiatCurrencyEnum[]) {
        //deposit amount is in fiat currency
        const { depositMinAmount, depositMaxAmount, withdrawMinAmount, withdrawMaxAmount } =
          await this.countryFeeService.findOneWalletDepositWithdrawalFee({
            countryId,
            currency: currency as FiatCurrencyEnum,
            method: method.code as CryptoCurrencyEnum,
          });

        //affect values
        [
          { for: 'min', val: type === 'Deposit' ? depositMinAmount : withdrawMinAmount },
          { for: 'max', val: type === 'Deposit' ? depositMaxAmount : withdrawMaxAmount },
        ].forEach((minOrMax) => {
          methods[i].data[currency][minOrMax.for] = convertFiat2Crypto(
            minOrMax.val,
            method.data[currency].exchange_rate,
            method.data[currency].after_decimal,
          );

          keecash_wallets[currency === 'EUR' ? 0 : 1][minOrMax.for][method.code] = minOrMax.val;
        });
      }
    }

    if (type == 'Deposit') {
      return { keecash_wallets, deposit_methods: methods };
    } else {
      return { keecash_wallets, withdrawal_methods: methods };
    }
  }

  async getDepositFee(countryId: number, query: GetDepositFeeDto) {
    const { depositFixedFee, depositPercentFee, depositMinAmount, depositMaxAmount } =
      await this.countryFeeService.findOneWalletDepositWithdrawalFee({
        countryId,
        currency: query.keecash_wallet,
        method: query.deposit_method,
      });

    const isDesiredAmountIntoMinAndMax =
      query.desired_amount >= depositMinAmount && query.desired_amount <= depositMaxAmount;

    if (!isDesiredAmountIntoMinAndMax) {
      throw new BadRequestException(
        `Amount out of range : Min: ${depositMinAmount} ${query.keecash_wallet} - Max: ${depositMaxAmount} ${query.keecash_wallet}`,
      );
    }

    const feesApplied = parseFloat(
      ((query.desired_amount * depositPercentFee) / 100 + depositFixedFee).toFixed(2),
    );

    const amountAfterFee = parseFloat((query.desired_amount + feesApplied).toFixed(2));

    return {
      fix_fees: depositFixedFee,
      percent_fees: depositPercentFee,
      fees_applied: feesApplied,
      total_to_pay: amountAfterFee,
    };
  }

  async getDepositPaymentLink(user: UserAccessTokenInterface, body: DepositPaymentLinkDto) {
    // Calculate fees
    const depositFeesInput = {
      keecash_wallet: body.keecash_wallet,
      deposit_method: body.deposit_method,
      desired_amount: body.desired_amount,
    };
    const fees = await this.getDepositFee(user.countryId, depositFeesInput);

    const userProfile = await this.userService.findOneWithProfileAndDocuments(
      { id: user.id },
      true,
      true,
    );

    // Trigger TripleA API
    const res = await this.tripleAService.deposit({
      amount: fees.total_to_pay,
      desired_amount: body.desired_amount,
      currency: body.keecash_wallet,
      email: user.email,
      keecashUserId: user.referralId,
      crypto: body.deposit_method,
      user: userProfile,
    });

    // Create a deposit transaction
    await this.transactionService.create({
      userId: user.id,
      currency: body.keecash_wallet,
      affectedAmount: body.desired_amount,
      appliedFee: fees.fees_applied,
      fixedFee: fees.fix_fees,
      percentageFee: fees.percent_fees,
      cryptoType: body.deposit_method,
      type: TxTypeEnum.Deposit,
      status: TransactionStatusEnum.InProgress, // TODO: set PERFORMED after webhook call
      description:
        userProfile.language === 'en'
          ? `Deposit from ${body.deposit_method}`
          : `Dépôt via ${body.deposit_method}`,
      reason: body.reason,
      tripleAPaymentReference: res.payment_reference,
    });

    return {
      link: res.hosted_url,
    };
  }

  // -------------- WITHDRAWAL -------------------

  async getWithdrawalFee(countryId: number, query: GetWithdrawalFeeDto) {
    const { withdrawFixedFee, withdrawPercentFee } =
      await this.countryFeeService.findOneWalletDepositWithdrawalFee({
        countryId,
        currency: query.keecash_wallet,
        method: query.withdrawal_method,
      });

    const feesApplied = parseFloat(
      ((query.desired_amount * withdrawPercentFee) / 100 + withdrawFixedFee).toFixed(2),
    );
    const amountAfterFee = parseFloat((query.desired_amount - feesApplied).toFixed(2));

    return {
      fix_fees: withdrawFixedFee,
      percent_fees: withdrawPercentFee,
      fees_applied: feesApplied,
      total_to_pay: amountAfterFee,
    };
  }

  async applyWithdrawal(user: UserAccessTokenInterface, body: WithdrawalApplyDto) {
    //check if adress is valid
    const addressCheckResponse = await this.beneficiaryService.validateCryptoAddress(
      body.withdrawal_method,
      body.wallet_address,
      user.id,
    );

    if (!addressCheckResponse.isCryptoWalletOK) {
      throw new UnauthorizedException(`Address not valid for ${body.withdrawal_method}`);
    }

    // Check if user has enough balance
    const balanceRaw = await this.transactionService.getBalanceArrayByCurrency(
      user.id,
      body.keecash_wallet,
    );

    const balance = balanceRaw ? balanceRaw.balance : 0;

    if (balance < body.target_amount) {
      throw new BadRequestException('Total pay amount exceeds current wallet balance');
    }

    //get essential settings data for withdrawal
    const { withdrawFixedFee, withdrawPercentFee, withdrawMinAmount, withdrawMaxAmount } =
      await this.countryFeeService.findOneWalletDepositWithdrawalFee({
        countryId: user.countryId,
        currency: body.keecash_wallet,
        method: body.withdrawal_method,
      });

    //Check min max
    const isDesiredAmountIntoMinAndMax =
      body.target_amount >= withdrawMinAmount && body.target_amount <= withdrawMaxAmount;
    if (!isDesiredAmountIntoMinAndMax) {
      throw new BadRequestException(
        `Amount out of range : Min: ${withdrawMinAmount} ${body.keecash_wallet} - Max: ${withdrawMaxAmount} ${body.keecash_wallet}`,
      );
    }

    // Calculate fees
    const feesApplied = parseFloat(
      ((body.target_amount * withdrawPercentFee) / 100 + withdrawFixedFee).toFixed(2),
    );
    const amountAfterFee = parseFloat((body.target_amount - feesApplied).toFixed(2));

    // Add beneficiary user wallet only if cryptoWallet not already save by the user
    if (body.to_save_as_beneficiary && !addressCheckResponse.isCryptoWalletAlreadySave) {
      await this.beneficiaryService.createBeneficiaryWallet({
        userId: user.id,
        address: body.wallet_address,
        name: body.wallet_name,
        type: body.withdrawal_method,
      });
    }

    //prepare to send to tripleA
    const userProfile = await this.userService.findOneWithProfileAndDocuments(
      { id: user.id },
      true,
      true,
    );

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
      userId: user.id,
      currency: body.keecash_wallet,
      affectedAmount: -body.target_amount,
      appliedFee: feesApplied,
      fixedFee: withdrawFixedFee,
      percentageFee: withdrawPercentFee,
      cryptoType: body.withdrawal_method,
      type: TxTypeEnum.Withdrawal,
      status: TransactionStatusEnum.InProgress,
      description:
        userProfile.language === 'en'
          ? `Withdrawal in ${body.withdrawal_method}`
          : `Retrait en ${body.withdrawal_method}`,
      reason: body.reason,
      tripleAPaymentReference: res.payout_reference,
    });
  }

  // -------------- TRANSFER -------------------

  async getTransferSettings(countryId: number, userId: number) {
    const walletBalance = await this.transactionService.getWalletBalances(userId);

    const manyTransferSettings =
      await this.countryFeeService.findManyTransferReferralCardWithdrawalFee({
        countryId,
      });

    return manyTransferSettings.map((settings) => {
      return {
        currency: settings.currency,
        balance: walletBalance[settings.currency],
        is_checked: true, // the first element always true
        min: settings.transferMinAmount,
        max: settings.transferMaxAmount,
        after_decimal: 2,
      };
    });
  }

  async getTransferFee(countryId: number, body: GetTransferFeeDto) {
    const { transferFixedFee, transferPercentFee } =
      await this.countryFeeService.findOneTransferReferralCardWithdrawalFee({
        countryId,
        currency: body.keecash_wallet,
      });

    const feesApplied = parseFloat(
      ((body.desired_amount * transferPercentFee) / 100 + transferFixedFee).toFixed(2),
    );
    const amountAfterFee = parseFloat((body.desired_amount - feesApplied).toFixed(2));

    return {
      fix_fees: transferFixedFee,
      percent_fees: transferPercentFee,
      fees_applied: feesApplied,
      total_to_pay: amountAfterFee,
    };
  }

  async applyTransfer(userId: number, countryId: number, body: TransferApplyDto) {
    // Check if user has enough balance
    const balanceRaw = await this.transactionService.getBalanceArrayByCurrency(
      userId,
      body.keecash_wallet,
    );

    const balance = balanceRaw ? balanceRaw.balance : 0;

    if (balance < body.desired_amount) {
      throw new BadRequestException('Requested transfer amount exceeds current wallet balance');
    }

    //check condition on beneficiary before perform the transfer => throw error if not good
    await this.beneficiaryService.checkConditionsToAddBeneficiary(body.beneficiary_user_id, userId);

    const senderProfile = await this.userService.findOneWithProfileAndDocuments(
      { id: userId },
      true,
      false,
    );

    const receiverProfile = await this.userService.findOneWithProfileAndDocuments(
      { id: body.beneficiary_user_id },
      true,
      false,
    );

    // Calculate fees
    const { transferFixedFee, transferPercentFee } =
      await this.countryFeeService.findOneTransferReferralCardWithdrawalFee({
        countryId,
        currency: body.keecash_wallet,
      });
    const feesApplied = parseFloat(
      ((body.desired_amount * transferPercentFee) / 100 + transferFixedFee).toFixed(2),
    );
    const amountAfterFee = parseFloat((body.desired_amount - feesApplied).toFixed(2));

    // Create 2 database transaction records for both sender and receiver
    await this.transactionService.createMany([
      {
        userId,
        receiverId: body.beneficiary_user_id,
        currency: body.keecash_wallet,
        affectedAmount: -body.desired_amount,
        appliedFee: feesApplied,
        fixedFee: transferFixedFee,
        percentageFee: transferPercentFee,
        type: TxTypeEnum.TransferSent,
        status: TransactionStatusEnum.Performed, // TODO: Consider pending status in this transaction.
        description:
          senderProfile.language === 'en'
            ? `Transfer to ${receiverProfile.lastName.split(' ')[0]} ${
                receiverProfile.firstName.split(' ')[0]
              }`
            : `Transfert vers ${receiverProfile.lastName.split(' ')[0]} ${
                receiverProfile.firstName.split(' ')[0]
              }`,
        reason: body.reason,
      },
      {
        userId: body.beneficiary_user_id,
        senderId: userId,
        currency: body.keecash_wallet,
        affectedAmount: amountAfterFee,
        appliedFee: feesApplied,
        fixedFee: transferFixedFee,
        percentageFee: transferPercentFee,
        type: TxTypeEnum.TransferReceived,
        status: TransactionStatusEnum.Performed, // TODO: Consider pending status in this transaction.
        description:
          receiverProfile.language === 'en'
            ? `Transfer received from ${senderProfile.lastName.split(' ')[0]} ${
                senderProfile.firstName.split(' ')[0]
              }`
            : `Transfert reçu de ${senderProfile.lastName.split(' ')[0]} ${
                senderProfile.firstName.split(' ')[0]
              }`,
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
    userId: number,
    currency: FiatCurrencyEnum,
    query: GetWalletTransactionsQueryDto,
  ) {
    const transactions = await this.transactionService.findManyByFilter(userId, currency, query);

    return transactions;
  }

  // -------------- CREATE CARD -------------------

  async getCreateCardSettings(countryId: number, userId: number, query: GetTopupSettingQueryDto) {
    const walletBalance = await this.transactionService.getWalletBalances(userId);

    const userProfile = await this.userService.findOneWithProfileAndDocuments(
      { id: userId },
      true,
      false,
    );

    const getCardTypes = async (currencyIn: FiatCurrencyEnum) => {
      const cardPrices = await this.countryFeeService.findCardPrices({
        type: CardTypeEnum.Virtual, // Bridgecard provides VIRTUAL cards only
        countryId,
        currency: currencyIn,
      });

      const multipleCardPrice = cardPrices.find((price) => price.usage === CardUsageEnum.Multiple);
      const uniqueCardPrice = cardPrices.find((price) => price.usage === CardUsageEnum.Unique);

      if (!multipleCardPrice || !uniqueCardPrice) {
        throw new NotFoundException('Cannot find card prices for requested country');
      }

      const { cardTopUpMinAmount, cardTopUpFixedFee } =
        await this.countryFeeService.findOneCardTopupFee({
          countryId,
          currency: currencyIn,
          usage: query ? query.cardUsageType : CardUsageEnum.Multiple,
        });

      const getCardPriceFromType = async (type: CardUsageEnum) => {
        return await this.countryFeeService.findOneCardPrice({
          countryId,
          currency: currencyIn,
          usage: type,
          type: CardTypeEnum.Virtual, // Bridgecard provides VIRTUAL cards only
        });
      };

      const cardPriceMultiple = (await getCardPriceFromType(CardUsageEnum.Multiple)).cardPrice;

      const cardPriceUnique = (await getCardPriceFromType(CardUsageEnum.Unique)).cardPrice;

      const keecashWallet = {
        currency: currencyIn,
        balance: walletBalance[currencyIn],
        is_checked: true,
        min: cardTopUpMinAmount,
        max: cardTopUpFixedFee,
        after_decimal: 2,
        cardTypes: [
          {
            name: userProfile.language === 'en' ? 'Multiple use card' : 'Carte à usage multiple',
            type: 'MULTIPLE',
            description:
              userProfile.language === 'en'
                ? 'Topped up multiple time'
                : 'Rechargeable plusieurs fois',
            is_checked: true,
            price: cardPriceMultiple,
            cardValidity: '2 years',
          },
          {
            name: userProfile.language === 'en' ? 'Single use card' : 'Carte à usage unique',
            type: 'SINGLE',
            description:
              userProfile.language === 'en' ? 'Topped up one time' : 'Rechargeable une fois',
            is_checked: false,
            price: cardPriceUnique,
            cardValidity: '2 years',
          },
        ],
      };

      return keecashWallet;
    };

    const keecashWallets = [];
    for (const eachCurrency of ['EUR', 'USD'] as FiatCurrencyEnum[]) {
      keecashWallets.push(await getCardTypes(eachCurrency));
    }

    return keecashWallets;
  }

  async getFeesAppliedTotalToPay(
    userId: number,
    body: GetCreateCardTotalFeeDto,
    includeFees?: boolean,
  ) {
    const {
      personProfile: { countryId },
    } = await this.userService.findOneWithProfileAndDocuments({ id: userId }, true, false);

    const { cardTopUpPercentFee, cardTopUpFixedFee, cardTopUpMinAmount, cardTopUpMaxAmount } =
      await this.countryFeeService.findOneCardTopupFee({
        countryId,
        currency: body.currency,
        usage: body.cardUsageType,
      });

    const { cardPrice } = await this.countryFeeService.findOneCardPrice({
      countryId,
      currency: body.currency,
      usage: body.cardUsageType,
      type: CardTypeEnum.Virtual, // Bridgecard provides VIRTUAL cards only
    });

    //Check min max
    const isDesiredAmountIntoMinAndMax =
      body.desiredAmount >= cardTopUpMinAmount && body.desiredAmount <= cardTopUpMaxAmount;

    if (!isDesiredAmountIntoMinAndMax) {
      throw new BadRequestException(
        `Amount out of range : Min: ${cardTopUpMinAmount} ${body.currency} - Max: ${cardTopUpMaxAmount} ${body.currency}`,
      );
    }

    const feesApplied = parseFloat(
      ((body.desiredAmount * cardTopUpPercentFee) / 100 + cardTopUpFixedFee).toFixed(2),
    );

    const totalToPay = parseFloat((cardPrice + body.desiredAmount + feesApplied).toFixed(2));

    if (includeFees) {
      return {
        fixedFee: cardTopUpFixedFee,
        percentageFee: cardTopUpPercentFee,
        feesApplied,
        cardPrice,
        totalToPay,
        cardTopUpFixedFee,
        cardTopUpPercentFee,
      };
    } else {
      return {
        fixedFee: cardTopUpFixedFee,
        percentageFee: cardTopUpPercentFee,
        feesApplied,
        cardPrice,
        totalToPay,
      };
    }
  }

  async createCard(
    userId: number,
    countryId: number,
    body: CreateCardDto,
    query: CardBrandQueryDto,
  ) {
    const { cardholderId, cardholderVerified } =
      await this.userService.findOneWithProfileAndDocuments({ id: userId }, true, false);

    if (!cardholderId || !cardholderVerified) {
      throw new BadRequestException('User is not registered in Bridgecard provider');
    }

    //Function to capitalize first letter and let over in lowercase : flexible ==> Flexible
    const formatCardName = (cardName: string) => {
      return cardName.charAt(0).toUpperCase() + cardName.slice(1);
    };

    const cardName = formatCardName(body.name);

    //we check if the name to give to the card is unique
    const card = await this.findOne({ userId: userId, name: cardName });

    if (card) {
      throw new BadRequestException(`You already use this card name.`);
    }

    // Calculate price
    const createCardGetFees: GetCreateCardTotalFeeDto = {
      currency: body.keecashWallet,
      cardUsageType: body.cardUsage,
      desiredAmount: body.topupAmount,
    };
    const fees = await this.getFeesAppliedTotalToPay(userId, createCardGetFees, true);

    const balanceRaw = await this.transactionService.getBalanceArrayByCurrency(
      userId,
      body.keecashWallet,
    );

    const balance = balanceRaw ? balanceRaw.balance : 0;

    if (balance < fees.totalToPay) {
      throw new BadRequestException('Total pay amount exceeds current wallet balance');
    }

    //TODO: check balance of bridgecard and if not enough just debit user, schedule the transaction when bridgecard account will be topup
    // todo with kafka process

    // Create a Bridgecard
    const bridgecardId = await this.bridgecardService.createCard({
      userId,
      cardholderId,
      type: body.cardType,
      brand: query.cardBrand ?? CardBrandEnum.Visa, // default
      currency: body.keecashWallet,
      cardName: cardName,
    });

    //Top up the card
    await this.bridgecardService.fundCard({
      card_id: bridgecardId,
      amount: body.topupAmount * 100, // Amount in cents
      transaction_reference: uuid(),
      currency: body.keecashWallet,
    });

    // TODO: Implement database transaction rollback mechanism, using queryRunnet.connect() startTransation(), commitTransaction(), rollbackTransaction(), release()
    const { id: cardId } = await this.create({
      userId,
      name: body.name,
      bridgecardId,
      currency: body.keecashWallet,
      usage: body.cardUsage,
    });

    const userProfile = await this.userService.findOneWithProfileAndDocuments(
      { id: userId },
      true,
      false,
    );

    // Create a transaction
    await this.transactionService.create({
      userId,
      currency: body.keecashWallet,
      cardPrice: fees.cardPrice,
      appliedFee: fees.feesApplied,
      affectedAmount: -fees.totalToPay,
      fixedFee: fees.cardTopUpFixedFee,
      percentageFee: fees.cardTopUpPercentFee,
      cardId,
      type: TxTypeEnum.CardCreation,
      status: TransactionStatusEnum.Performed, // Should be set to PENDING and update by webhook
      description:
        userProfile.language === 'en'
          ? `Card creation: ${body.name}`
          : `Création de la carte: ${body.name}`,
    });
  }

  // -------------- CARD TOPUP -------------------

  async getCardTopupSettings(
    user: UserAccessTokenInterface,
    cardId: string,
    query: GetTopupSettingQueryDto,
  ) {
    const card = await this.findOne({ userId: user.id, bridgecardId: cardId });
    if (!card) {
      throw new NotFoundException('Cannot find card with requested id');
    }
    const walletBalance = await this.transactionService.getWalletBalances(user.id);

    const { cardTopUpMinAmount, cardTopUpMaxAmount } =
      await this.countryFeeService.findOneCardTopupFee({
        countryId: user.countryId,
        currency: card.currency,
        usage: query ? query.cardUsageType : CardUsageEnum.Multiple,
      });

    return {
      keecash_wallets: {
        currency: card.currency,
        balance: walletBalance[card.currency],
        is_checked: true,
        min: cardTopUpMinAmount,
        max: cardTopUpMaxAmount,
        after_decimal: 2,
      },
    };
  }

  async getCardTopupFees(
    user: UserAccessTokenInterface,
    query: GetCardTopupSettingDto,
    cardId: string,
  ) {
    const card = await this.findOne({ userId: user.id, bridgecardId: cardId });

    if (!card) {
      throw new NotFoundException('Cannot find card with requested id');
    }

    const { cardTopUpFixedFee, cardTopUpPercentFee } =
      await this.countryFeeService.findOneCardTopupFee({
        countryId: user.countryId,
        currency: card.currency,
        usage: card.usage,
      });

    const feesApplied = parseFloat(
      ((query.desiredAmount * cardTopUpPercentFee) / 100 + cardTopUpFixedFee).toFixed(2),
    );

    const totalToPay = parseFloat((query.desiredAmount + feesApplied).toFixed(2));

    return {
      fix_fees: cardTopUpFixedFee,
      percent_fees: cardTopUpPercentFee,
      fees_applied: feesApplied,
      total_to_pay: totalToPay,
    };
  }

  async applyCardTopup(userId: number, countryId: number, body: ApplyCardTopupDto, cardId: string) {
    const card = await this.findOne({ userId: userId, bridgecardId: cardId });

    if (!card) {
      throw new NotFoundException('Cannot find card with requested id');
    }

    const { currency, usage } = card;

    const { cardTopUpFixedFee, cardTopUpPercentFee } =
      await this.countryFeeService.findOneCardTopupFee({ countryId, currency, usage });

    const feesApplied = parseFloat(
      ((body.topupAmount * cardTopUpPercentFee) / 100 + cardTopUpFixedFee).toFixed(2),
    );

    const totalToPay = parseFloat((body.topupAmount + feesApplied).toFixed(2));

    const balanceRaw = await this.transactionService.getBalanceArrayByCurrency(userId, currency);

    const balance = balanceRaw ? balanceRaw.balance : 0;

    if (balance < totalToPay) {
      throw new BadRequestException('Total pay amount exceeds current wallet balance');
    }

    //TODO:get also available balance on provider of card to perform or put in waiting list when we will get more fund - To do in kafka

    // Deposit to card using Bridgecard provider
    await this.bridgecardService.fundCard({
      card_id: cardId,
      amount: body.topupAmount * 100, // Amount in cents
      transaction_reference: uuid(),
      currency,
    });

    const userProfile = await this.userService.findOneWithProfileAndDocuments(
      { id: userId },
      false,
      false,
    );

    const { name } = await this.findOne({ bridgecardId: cardId });

    await this.transactionService.create({
      userId,
      currency,
      affectedAmount: -totalToPay,
      appliedFee: feesApplied,
      fixedFee: cardTopUpFixedFee,
      percentageFee: cardTopUpPercentFee,
      type: TxTypeEnum.CardTopup,
      status: TransactionStatusEnum.Performed,
      description:
        userProfile.language === 'en' ? `Topup of ${name} card` : `Recharge de la carte ${name}`,
    });

    // TODO: Add to BullMQ
    await this.notificationService.create({
      userId,
      type: NotificationType.CardTopup,
      amount: totalToPay,
      currency,
    });
  }

  // -------------- CARD WITHDRAWAL -------------------

  async getCardWithdrawalSettings(countryId: number, userId: number, cardId: string) {
    const card = await this.findOne({ userId: userId, bridgecardId: cardId });
    if (!card) {
      throw new NotFoundException('Cannot find card with requested id');
    }

    const {
      cardWithdrawMinAmount,
      cardWithdrawMaxAmount,
      cardWithdrawFixedFee,
      cardWithdrawPercentFee,
    } = await this.countryFeeService.findOneTransferReferralCardWithdrawalFee({
      countryId: countryId,
      currency: card.currency,
    });

    //TODO:get also available balance on provider of card to perform or put in waiting list when we will get more fund - To do in kafka

    const balance = await this.bridgecardService.getCardBalance(card.bridgecardId);

    return {
      card_info: {
        currency: card.currency,
        balance: balance,
        is_checked: true,
        min: Math.ceil(cardWithdrawMinAmount + cardWithdrawFixedFee),
        max: cardWithdrawMaxAmount,
        after_decimal: 2,
      },
      fix_fees: cardWithdrawFixedFee,
      percent_fees: cardWithdrawPercentFee,
    };
  }

  async getCardWithdrawalFees(
    countryId: number,
    body: GetCardWithdrawalSettingDto,
    cardId: string,
    withCurrency?: boolean,
  ) {
    const { currency } = await this.findOne({ bridgecardId: cardId });

    const {
      cardWithdrawFixedFee,
      cardWithdrawPercentFee,
      cardWithdrawMinAmount,
      cardWithdrawMaxAmount,
    } = await this.countryFeeService.findOneTransferReferralCardWithdrawalFee({
      countryId,
      currency,
    });

    const isDesiredAmountIntoMinAndMax =
      body.desiredAmount >= cardWithdrawMinAmount && body.desiredAmount <= cardWithdrawMaxAmount;

    if (!isDesiredAmountIntoMinAndMax) {
      throw new BadRequestException(
        `Amount out of range : Min: ${cardWithdrawMinAmount} ${currency} - Max: ${cardWithdrawMaxAmount} ${currency}`,
      );
    }

    const feesApplied = parseFloat(
      ((body.desiredAmount * cardWithdrawPercentFee) / 100 + cardWithdrawFixedFee).toFixed(2),
    );

    const totalToPay = parseFloat((body.desiredAmount + feesApplied).toFixed(2));

    let cardFees = {
      fix_fees: cardWithdrawFixedFee,
      percent_fees: cardWithdrawPercentFee,
      fees_applied: feesApplied,
      total_to_pay: totalToPay,
    };

    if (withCurrency) {
      cardFees = { ...cardFees, ...{ currency } };
    }

    return cardFees;
  }

  async applyCardWithdrawal(
    userId: number,
    countryId: number,
    body: GetCardWithdrawalSettingDto,
    cardId: string,
  ) {
    const cardFees = await this.getCardWithdrawalFees(countryId, body, cardId, true);

    const currency = cardFees['currency'] as FiatCurrencyEnum;

    const balance = await this.bridgecardService.getCardBalance(cardId);

    if (balance < cardFees.total_to_pay) {
      throw new BadRequestException(
        `Need at least ${cardFees.total_to_pay} ${currency} on the card to perform this transaction`,
      );
    }

    // Withdraw from card using Bridgecard provider
    await this.bridgecardService.unloadCard({
      card_id: cardId,
      amount: cardFees.total_to_pay * 100, // Amount in cents
      transaction_reference: uuid(),
      currency: currency,
    });

    const userProfile = await this.userService.findOneWithProfileAndDocuments(
      { id: userId },
      true,
      false,
    );

    const { name } = await this.findOne({ bridgecardId: cardId });

    await this.transactionService.create({
      userId,
      currency,
      affectedAmount: body.desiredAmount,
      appliedFee: cardFees.fees_applied,
      fixedFee: cardFees.fix_fees,
      percentageFee: cardFees.percent_fees,
      type: TxTypeEnum.CardWithdrawal,
      status: TransactionStatusEnum.Performed,
      description:
        userProfile.language === 'en'
          ? `Withdrawal from ${name} card`
          : `Retrait de la carte ${name}`,
    });

    // TODO: Add to BullMQ
    await this.notificationService.create({
      userId,
      type: NotificationType.CardWithdrawal,
      amount: body.desiredAmount,
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
        this.logger.log(`card_creation_event.successful : ${data.card_id}`);
        break;

      case 'card_creation_event.failed':
        this.logger.log(`card_creation_event.failed : ${data.card_id}`);
        break;

      case 'card_credit_event.successful':
        this.logger.log(`card_credit_event.successful : ${data.card_id}`);
        break;

      case 'card_credit_event.failed':
        this.logger.log(`card_credit_event.failed : ${data.card_id}`);
        break;

      case 'card_debit_event.successful':
        this.logger.log(`card_debit_event.successful : ${data.card_id}`);
        break;

      case 'card_debit_event.declined':
        this.logger.log(`card_debit_event.declined : ${data.card_id}`);
        break;

      case 'card_reversal_event.successful':
        this.logger.log(`card_reversal_event.successful : ${data.card_id}`);
        break;

      case '3d_secure_otp_event.generated':
        this.logger.log(`3d_secure_otp_event.generated : ${data.card_id}`);
        break;

      default:
        break;
    }
  }

  // ------------------ TripleA Webhook Handler ----------------------

  validateSignatureWebhook(req: Request) {
    const sig = req.headers['triplea-signature'] as string;

    let timestamp, signature;

    for (const sig_part of sig.split(',')) {
      const [key, value] = sig_part.split('=');

      switch (key) {
        case 't':
          timestamp = value;
          break;
        case 'v1':
          signature = value;
          break;
      }
    }

    // calculate signature
    const secret = this.configService.get('tripleAConfig.tripleANotifySecret');

    const check_signature = crypto
      .createHmac('sha256', secret)
      .update(`${timestamp}.${JSON.stringify(req.body)}`)
      .digest('hex');

    // current timestamp
    const curr_timestamp = Math.round(new Date().getTime() / 1000);

    if (
      signature === check_signature && // verify signature
      Math.abs(curr_timestamp - timestamp) <= 300 // timestamp within tolerance
    ) {
      return true;
    } else {
      return false;
    }
  }

  async handleDepositNotification(req: Request) {
    if (!this.validateSignatureWebhook(req)) {
      throw new UnauthorizedException('Signature failed');
    }

    const body: WebhookDepositResponseInterface = req.body;

    if (
      body.payment_tier === 'good' ||
      body.payment_tier === 'short' ||
      body.payment_tier === 'hold'
    ) {
      const keecashId = body.webhook_data.payer_id.split('+')[1]; // payer_id looks like 'keecash+SV08DV8'

      const receiver = await this.userService.findOneWithProfileAndDocuments(
        { referralId: keecashId },
        true,
        false,
      );

      let canCheckReferral = false;

      // Update IN PROGRESS transaction's status to 'PERFORMED' in case of good
      if (body.payment_tier === 'good') {
        canCheckReferral = true;
        await this.transactionService.update(
          {
            tripleAPaymentReference: body.payment_reference,
            type: TxTypeEnum.Deposit,
            status: TransactionStatusEnum.InProgress,
          },
          {
            status: TransactionStatusEnum.Performed,
            exchangeRate: body.exchange_rate,
            cryptoAmount: body.payment_crypto_amount,
          },
        );

        // TODO: Add to Redis/BullMQ message queue asynchronously
        // Create a notification for the transaction
        await this.notificationService.create({
          userId: receiver.id,
          type: NotificationType.Deposit,
          amount: body.webhook_data.desired_amount,
          currency: body.payment_currency,
        });
      }
      //in the case of short we need to check the amount paid and update all the transaction before apply PERFORMED
      else if (body.payment_tier === 'short') {
        canCheckReferral = true;
        const { depositFixedFee, depositPercentFee, depositMinAmount, depositMaxAmount } =
          await this.countryFeeService.findOneWalletDepositWithdrawalFee({
            countryId: receiver.personProfile.countryId,
            currency: body.order_currency as FiatCurrencyEnum,
            method: body.crypto_currency as CryptoCurrencyEnum,
          });

        try {
          const desiredAmountRecalculated = parseFloat(
            (body.payment_amount * (1 - depositPercentFee / 100) - depositFixedFee).toFixed(2),
          );
          const depositFees: GetDepositFeeDto = {
            keecash_wallet: body.order_currency as FiatCurrencyEnum,
            deposit_method: body.crypto_currency as CryptoCurrencyEnum,
            desired_amount: desiredAmountRecalculated,
          };
          const fees = await this.getDepositFee(receiver.personProfile.countryId, depositFees);

          await this.transactionService.update(
            {
              tripleAPaymentReference: body.payment_reference,
              type: TxTypeEnum.Deposit,
              status: TransactionStatusEnum.InProgress,
            },
            {
              affectedAmount: desiredAmountRecalculated,
              appliedFee: fees.fees_applied,
              fixedFee: fees.fix_fees,
              percentageFee: fees.percent_fees,
              status: TransactionStatusEnum.Performed,
              description:
                receiver.language === 'en'
                  ? `Deposit from ${body.crypto_currency}`
                  : `Dépôt via ${body.crypto_currency}`,
              exchangeRate: body.exchange_rate,
            },
          );

          // TODO: Add to Redis/BullMQ message queue asynchronously
          // Create a notification for the transaction
          await this.notificationService.create({
            userId: receiver.id,
            type: NotificationType.Deposit,
            amount: desiredAmountRecalculated,
            currency: body.payment_currency,
          });
        } catch (e) {
          //send email to the user with explanation
          await this.sendgridService.sendGenericEmail({
            email: receiver.email,
            header:
              receiver.language === 'en'
                ? 'Your payment is rejected'
                : 'Votre paiement est rejeté ',
            body:
              receiver.language === 'en'
                ? `Your payment was rejected because the amount is either too small or too large than what is acceptable in your country.` +
                  `\nHere is the amount we received: ` +
                  `\n${body.crypto_amount} ${body.crypto_currency} ↔ ${body.payment_amount} ${body.payment_currency}` +
                  `\nCrypto address where you send your crypto: ${body.crypto_address}` +
                  `\nThe minimum expected is ${depositMinAmount} ${body.payment_currency} and the maximum is ${depositMaxAmount} ${body.payment_currency}` +
                  `\nBecause you have not met the stated thresolds, this amount will not be refunded to you in accordance with our Terms of Service`
                : `Votre paiement a été rejeté car le montant est soit trop petit ou soit trop grand que ce qui est acceptable dans votre pays.` +
                  `\nVoici le montant que nous avons reçu: ` +
                  `\n${body.payment_crypto_amount} ${body.crypto_currency} ↔ ${body.payment_amount} ${body.payment_currency}` +
                  `\nLe minimum attendu est de ${depositMinAmount} ${body.payment_currency} et le maximum est de ${depositMaxAmount} ${body.payment_currency}` +
                  `\nL'adresse où vous avez effectué l'envoi: ${body.crypto_address}` +
                  `\nEtant donné que vous n'avez pas respecté les seuils indiqués, ce montant ne vous sera pas remboursé conformément à nos conditions d'utilisations`,
            emailTopImage: 'ko',
          });
        }
      } else {
        //we keep the transaction in state IN_PROGRESS
        this.logger.debug(`${body.payment_reference} in hold state`);
      }

      if (canCheckReferral) {
        const referralUser = await this.userService.getReferralUser(receiver.id);

        if (referralUser) {
          const { referralFixedFee, referralPercentageFee } =
            await this.countryFeeService.findOneTransferReferralCardWithdrawalFee({
              countryId: receiver.personProfile.countryId,
            });

          await this.transactionService.create({
            receiverId: referralUser.id,
            appliedFee: parseFloat(
              ((body.order_amount * referralPercentageFee) / 100 + referralFixedFee).toFixed(2),
            ), // TODO: Check with Hol to define the fee
            fixedFee: referralFixedFee,
            percentageFee: referralPercentageFee,
            type: TxTypeEnum.ReferralFee,
            currency: body.order_currency as FiatCurrencyEnum,
            tripleAPaymentReference: body.payment_reference,
            status: TransactionStatusEnum.Performed,
            reason:
              referralUser.language === 'en'
                ? `Referral earnings from ${referralUser.email}`
                : `Gain de parrainage de ${referralUser.email}`,
            description:
              referralUser.language === 'en'
                ? `Referral earnings from ${referralUser.lastName.split(' ')[0]} ${
                    referralUser.firstName.split(' ')[0]
                  }`
                : `Gain de parrainage de ${referralUser.lastName.split(' ')[0]} ${
                    referralUser.firstName.split(' ')[0]
                  }`,
          });
        }
      }
    } else {
      // TODO: Update specific status options: 'hold', 'invalid'
      // Update IN PROGRESS transaction's status to 'REJECTED'
      await this.transactionService.update(
        {
          tripleAPaymentReference: body.payment_reference,
          type: TxTypeEnum.Deposit,
        },
        { status: TransactionStatusEnum.Rejected },
      );
    }
  }

  async handleWithdrawalNotification(req: Request) {
    //TODO:check if crypto provider available balance is suffisient to perform ELSE put in waiting list, inform the user about the execution delay when we will get more fund - To do in kafka

    if (!this.validateSignatureWebhook(req)) {
      throw new UnauthorizedException('Signature failed');
    }

    const body: TripleAWithdrawalNotifyDto = req.body;

    const details = await this.tripleAService.getWithdrawalDetails(
      body.payout_reference,
      body.local_currency,
    );

    // details.status : 'new', 'confirm', 'done', 'cancel'. See https://developers.triple-a.io/docs/triplea-api-doc/a6c4376384c1e-3-get-payout-details-by-order-id
    if (details.status === 'done') {
      // const { senderId } = await this.transactionService.findOne({
      //   tripleAPaymentReference: body.payout_reference,
      //   type: TxTypeEnum.Withdrawal,
      //   status: TransactionStatusEnum.InProgress
      // });

      // const referralUser = await this.userService.getReferralUser(senderId);
      const user = await this.userService.findOneWithProfileAndDocuments(
        { referralId: body.order_id.split('-')[0] },
        true,
        false,
      );

      await this.transactionService.update(
        {
          tripleAPaymentReference: body.payout_reference,
          type: TxTypeEnum.Withdrawal,
          status: TransactionStatusEnum.InProgress,
        },
        {
          status: TransactionStatusEnum.Performed,
          exchangeRate: body.exchange_rate,
        },
      );

      // TODO: Add to BullMQ
      // Create a notification for the transaction
      await this.notificationService.create({
        userId: user.id,
        type: NotificationType.Withdrawal,
        amount: body.crypto_amount,
        currency: body.local_currency,
      });
    }
  }
}
