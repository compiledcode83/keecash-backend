import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { CardRepository } from './card.repository';
import { GetDepositFeeDto } from './dto/get-deposit-fee.dto';
import { CryptoCurrencyEnum, FiatCurrencyEnum, TxTypeEnum } from '../crypto-tx/crypto-tx.types';
import { GetWithdrawalFeeDto } from './dto/get-withdrawal-fee.dto';
import { GetTransferFeeDto } from './dto/get-transfer-fee.dto';
import { TransactionService } from '../transaction/transaction.service';
import deposit_methods from './deposit_methods.json';
import withdrawal_methods from './withdrawal_methods.json';
import { GetCreateCardTotalFeeDto } from './dto/get-create-card-total-fee.dto';
import { Card } from './card.entity';
import { CountryFeeService } from '@api/country-fee/country-fee.service';
import { UserService } from '../user/user.service';
import { CreateCardDto } from './dto/create-card.dto';
import { BridgecardService } from '../bridgecard/bridgecard.service';
import { CardBrandEnum, CardTypeEnum, CardUsageEnum } from './card.types';
import { GetCreateCardSettingsDto } from './dto/get-create-card-settings.dto';
import { TransactionStatusEnum } from '../transaction/transaction.types';

@Injectable()
export class CardService {
  private readonly logger = new Logger(BridgecardService.name);

  constructor(
    private readonly cardRepository: CardRepository,
    private readonly transactionService: TransactionService,
    private readonly countryFeeService: CountryFeeService,
    private readonly bridgecardService: BridgecardService,
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
  ) {}

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

  async createBridgecard(userId: number, body: CreateCardDto) {
    const { balance } = await this.transactionService.getBalanceArrayByCurrency(
      userId,
      body.keecashWallet,
    );

    if (balance < body.totalToPay) {
      throw new BadRequestException('Total pay amount exceeds current wallet balance');
    }

    const {
      cardholderId,
      personProfile: { countryId },
    } = await this.userService.findOneWithProfileAndDocumments(userId, true, false);

    const bridgecardId = await this.bridgecardService.createCard({
      userId,
      cardholderId,
      type: body.cardType,
      brand: CardBrandEnum.Visa, // default
      currency: body.keecashWallet,
      cardName: body.name,
    });

    // TODO: Implement database transaction rollback mechanism, using queryRunnet.connect() startTransation(), commitTransaction(), rollbackTransaction(), release()
    const { id: cardId } = await this.create({
      userId,
      name: body.name,
      bridgecardId,
    });

    const { cardPrice } = await this.countryFeeService.findOneCardPrice({
      countryId,
      currency: body.keecashWallet,
      type: body.cardType,
      usage: body.cardUsage,
    });

    const { cardTopUpFixedFee, cardTopUpPercentFee } =
      await this.countryFeeService.findCardTopupFee({
        countryId,
        currency: body.keecashWallet,
        usage: body.cardUsage,
      });

    const targetAmount = body.topupAmount;
    const appliedFee = cardTopUpFixedFee + cardTopUpPercentFee * targetAmount;
    const appliedAmount = cardPrice + targetAmount + appliedFee;

    await this.transactionService.create({
      senderId: userId,
      currency: body.keecashWallet,
      cardPrice,
      targetAmount,
      appliedFee,
      appliedAmount,
      fixedFee: cardTopUpFixedFee,
      percentageFee: cardTopUpPercentFee,
      cardId,
      type: TxTypeEnum.CardCreation,
      status: TransactionStatusEnum.Performed, // Should be set to PENDING and update by webhook
    });
  }

  async getDashboardItemsByUserId(userId: number): Promise<any> {
    const walletBalance = await this.transactionService.getWalletBalances(userId);

    const { cardholderId } = await this.userService.findOne({ id: userId });

    const cards = await this.bridgecardService.getAllCardholderCards(cardholderId);

    const eurCards = cards
      .filter(({ card_currency }) => card_currency === FiatCurrencyEnum.EUR)
      .map(({ balance, card_currency, card_number, expiry_month, expiry_year, meta_data }) => ({
        balance,
        currency: card_currency,
        cardNumber: card_number,
        name: meta_data.keecash_card_name,
        date: `${expiry_month}/${expiry_year.slice(-2)}`,
      }));
    const usdCards = cards
      .filter(({ card_currency }) => card_currency === FiatCurrencyEnum.USD)
      .map(({ balance, card_currency, card_number, expiry_month, expiry_year, meta_data }) => ({
        balance,
        currency: card_currency,
        cardNumber: card_number,
        name: meta_data.keecash_card_name,
        date: { expiry_month, expiry_year },
      }));

    const result = [
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
    ];

    return result;
  }

  async getCardListByUserId(userId: number): Promise<any> {
    const { cardholderId } = await this.userService.findOne({ id: userId });

    const cards = await this.bridgecardService.getAllCardholderCards(cardholderId);

    const details = await Promise.all(
      cards.map(async (card) => {
        const balancePromise = this.bridgecardService.getCardBalance(card.card_id);
        const transactionsPromise = this.bridgecardService.getCardTransactions(card.card_id);

        const [balance, transactions] = await Promise.all([balancePromise, transactionsPromise]);

        return { balance, transactions };
      }),
    );

    const result = cards.map((card, i) => ({
      balance: details[i].balance,
      currency: card.card_currency,
      isBlock: !card.is_active,
      isExpired: new Date(`${card.expiry_year}-${card.expiry_month}-01`) < new Date(),
      cardNumber: card.card_number,
      name: card.meta_data.keecash_card_name,
      date: `${card.expiry_month}/${card.expiry_year.slice(-2)}`,
      cardholderName: card.card_name,
      lastTransaction:
        details[i].transactions.transactions && details[i].transactions.transactions[0],
    }));

    return result;
  }

  async blockCard(userId: number, cardId: string): Promise<void> {
    const card = this.cardRepository.findOne({ where: { userId, bridgecardId: cardId } });

    if (!card) {
      throw new UnauthorizedException('User does not have right to access the card');
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

  // -------------- GET SETTINGS -------------------

  async getDepositSettings(userId: number) {
    const balance = await this.transactionService.getWalletBalances(userId);

    const user = await this.userService.findOneWithProfileAndDocumments(userId, true, false);

    const keecash_wallets = [
      {
        balance: balance.eur,
        currency: 'EUR',
        is_checked: true,
        min: 0,
        max: 100000,
        after_decimal: 2,
      },
      {
        balance: balance.usd,
        currency: 'USD',
        is_checked: false,
        min: 0,
        max: 100000,
        after_decimal: 2,
      },
    ];

    return {
      keecash_wallets,
      deposit_methods,
      fix_fees: 0.99,
      percent_fees: 0.01,
    };
  }

  async getWithdrawalSettings(userId: number) {
    const balance = await this.transactionService.getWalletBalances(userId);

    const keecash_wallets = [
      {
        balance: balance.eur,
        currency: 'EUR',
        is_checked: true,
        min: 0,
        max: balance.eur,
        after_decimal: 2,
      },
      {
        balance: balance.usd,
        currency: 'USD',
        is_checked: false,
        min: 0,
        max: balance.usd,
        after_decimal: 2,
      },
    ];

    return {
      keecash_wallets,
      withdrawal_methods,
      fix_fees: 0.99,
      percent_fees: 0.01,
    };
  }

  async getTransferSettings(userId: number, keecashId: string) {
    const balance = await this.transactionService.getWalletBalances(userId);

    const keecash_wallets = [
      {
        balance: balance.eur,
        currency: 'EUR',
        is_checked: true,
        min: 0,
        max: balance.eur,
        after_decimal: 2,
      },
      {
        balance: balance.usd,
        currency: 'USD',
        is_checked: false,
        min: 0,
        max: balance.usd,
        after_decimal: 2,
      },
    ];

    return {
      keecash_wallets,
      keecash_id: keecashId,
      fix_fees: 0.99,
      percent_fees: 0.01,
    };
  }

  // -------------- GET FEE -------------------

  async getDepositFee(body: GetDepositFeeDto) {
    const fixFees = 0.99;
    const percentFees = 0.01;

    let converted;

    switch (body.currency) {
      case 'BTC':
        converted = { amount: 20000 * body.desired_amount, exchange_rate: 20000 };
        break;

      case 'BTC_LIGHTNING':
        converted = { amount: 20000 * body.desired_amount, exchange_rate: 20000 };
        break;

      case 'ETH':
        converted = { amount: 2000 * body.desired_amount, exchange_rate: 2000 };
        break;

      case 'USDC':
        converted =
          body.keecash_wallet === 'USD'
            ? { amount: body.desired_amount, exchange_rate: 1 }
            : { amount: 0.99 * body.desired_amount, exchange_rate: 0.99 };
        break;

      case 'USDT_TRC20':
        converted =
          body.keecash_wallet === 'USD'
            ? { amount: body.desired_amount, exchange_rate: 1 }
            : { amount: 0.99 * body.desired_amount, exchange_rate: 0.99 };
        break;

      case 'USDT_ERC20':
        converted =
          body.keecash_wallet === 'USD'
            ? { amount: body.desired_amount, exchange_rate: 1 }
            : { amount: 0.99 * body.desired_amount, exchange_rate: 0.99 };
        break;

      case 'BINANCE':
        converted =
          body.keecash_wallet === 'USD'
            ? { amount: body.desired_amount, exchange_rate: 1 }
            : { amount: 0.99 * body.desired_amount, exchange_rate: 0.99 };
        break;

      default:
        converted = { amount: body.desired_amount, exchange_rate: 1 };
        break;
    }

    const feesApplied = (converted * percentFees + fixFees).toFixed(2);
    const totalToPay = converted + feesApplied;

    return {
      fix_fees: fixFees,
      percent_fees: percentFees,
      fees_applied: feesApplied,
      total_to_pay: totalToPay,
    };
  }

  async getWithdrawalFee(body: GetWithdrawalFeeDto) {
    const fixFees = 0.99;
    const percentFees = 0.01;

    let converted;

    switch (body.currency) {
      case 'BTC':
        converted = { amount: 20000 * body.desired_amount, exchange_rate: 20000 };
        break;

      case 'BTC_LIGHTNING':
        converted = { amount: 20000 * body.desired_amount, exchange_rate: 20000 };
        break;

      case 'ETH':
        converted = { amount: 2000 * body.desired_amount, exchange_rate: 2000 };
        break;

      case 'USDC':
        converted =
          body.keecash_wallet === 'USD'
            ? { amount: body.desired_amount, exchange_rate: 1 }
            : { amount: 0.99 * body.desired_amount, exchange_rate: 0.99 };
        break;

      case 'USDT_TRC20':
        converted =
          body.keecash_wallet === 'USD'
            ? { amount: body.desired_amount, exchange_rate: 1 }
            : { amount: 0.99 * body.desired_amount, exchange_rate: 0.99 };
        break;

      case 'USDT_ERC20':
        converted =
          body.keecash_wallet === 'USD'
            ? { amount: body.desired_amount, exchange_rate: 1 }
            : { amount: 0.99 * body.desired_amount, exchange_rate: 0.99 };
        break;

      case 'BINANCE':
        converted =
          body.keecash_wallet === 'USD'
            ? { amount: body.desired_amount, exchange_rate: 1 }
            : { amount: 0.99 * body.desired_amount, exchange_rate: 0.99 };
        break;

      default:
        converted = { amount: body.desired_amount, exchange_rate: 1 };
        break;
    }

    const feesApplied = (converted * percentFees + fixFees).toFixed(2);
    const totalToPay = converted + feesApplied;

    return {
      fix_fees: fixFees,
      percent_fees: percentFees,
      fees_applied: feesApplied,
      total_to_pay: totalToPay,
    };
  }

  async getTransferFee(body: GetTransferFeeDto) {
    const fixFees = 0.99;
    const percentFees = 0.01;

    const feesApplied = body.desired_amount * percentFees + fixFees;
    const totalToPay = body.desired_amount - feesApplied;

    return {
      fix_fees: fixFees,
      percent_fees: percentFees,
      fees_applied: feesApplied,
      total_to_pay: totalToPay,
    };
  }

  // -------------- GET BENEFICIARY -------------------

  async getBeneficiaryWallets(wallet: string) {
    const withdrawalSettings = {
      beneficiaries_wallet: [
        {
          name: 'My BTC wallet on Binance',
          type: CryptoCurrencyEnum.BTC,
          address: '0x57fe7ggeih4fe55hr5dzzf56',
        },
        {
          name: 'My BTC on Trust Wallet',
          type: CryptoCurrencyEnum.BTC,
          address: '0x57fe7ggeih4fe55hr5dzzf56',
        },
        {
          name: 'My BTC wallet on Binance',
          type: CryptoCurrencyEnum.BTC,
          address: '0x57fe7ggeih4fe55hr5dzzf56',
        },
        {
          name: 'My BTC on Trust Wallet',
          type: CryptoCurrencyEnum.BTC,
          address: '0x57fe7ggeih4fe55hr5dzzf56',
        },
        {
          name: 'My BTC wallet on Binance',
          type: CryptoCurrencyEnum.BTC,
          address: '0x57fe7ggeih4fe55hr5dzzf56',
        },
        {
          name: 'My BTC on Trust Wallet',
          type: CryptoCurrencyEnum.BTC,
          address: '0x57fe7ggeih4fe55hr5dzzf56',
        },
      ],
    };

    return withdrawalSettings;
  }

  // -------------- HISTORY -------------------

  async getInitHistory(userId: number) {
    const keecash_wallet_transactions = await this.transactionService.getAllTransactions(userId);

    const result = {
      keecash_wallet_transactions,
      card_transactions: [],
    };

    return result;
  }

  async getKeecashWalletTransactions(userId: number, currency: FiatCurrencyEnum) {
    const transactions = await this.transactionService.getAllTransactions(userId, currency);

    return transactions;
  }

  // -------------- CREATE CARD -------------------

  async getCreateCardSettings(userId: number, query: GetCreateCardSettingsDto) {
    const balance = await this.transactionService.getWalletBalances(userId);

    const keecashWallets = [
      {
        balance: balance.eur,
        currency: FiatCurrencyEnum.EUR,
        is_checked: true,
        min: 0,
        max: balance.eur,
        after_decimal: 2,
      },
      {
        balance: balance.usd,
        currency: FiatCurrencyEnum.USD,
        is_checked: false,
        min: 0,
        max: balance.usd,
        after_decimal: 2,
      },
    ];

    const {
      personProfile: { countryId },
    } = await this.userService.findOneWithProfileAndDocumments(userId, true, false);

    const cardPrices = await this.countryFeeService.findCardPrices({
      type: CardTypeEnum.Virtual, // Bridgecard provides VIRTUAL cards only
      countryId,
      currency: query.currency,
    });

    const cardTypes = [
      {
        name: 'Multiple use card',
        type: 'MULTIPLE',
        description: 'Topped up multiple time',
        is_checked: 'true',
        price: cardPrices.find((price) => price.usage === CardUsageEnum.Multiple),
        cardValidity: '2 years',
      },
      {
        name: 'Single use card',
        type: 'SINGLE',
        description: 'Topped up one time',
        is_checked: 'false',
        price: cardPrices.find((price) => price.usage === CardUsageEnum.Unique),
        cardValidity: '2 years',
      },
    ];

    return {
      keecashWallets,
      cardTypes,
    };
  }

  async getFeesAppliedTotalToPay(userId: number, body: GetCreateCardTotalFeeDto) {
    const {
      personProfile: { countryId },
    } = await this.userService.findOneWithProfileAndDocumments(userId, true, false);

    const { cardTopUpFixedFee, cardTopUpPercentFee } =
      await this.countryFeeService.findCardTopupFee({
        countryId,
        currency: body.currency,
        usage: body.cardType,
      });

    const feesApplied = body.desiredAmount * cardTopUpPercentFee + cardTopUpFixedFee;

    const { cardPrice } = await this.countryFeeService.findOneCardPrice({
      countryId,
      currency: body.currency,
      usage: body.cardType,
      type: CardTypeEnum.Virtual, // Bridgecard provides VIRTUAL cards only
    });

    const totalToPay = cardPrice + body.desiredAmount + feesApplied;

    return { feesApplied, totalToPay };
  }

  // ------------------ Bridgecard Webhook Handler ----------------------

  async handleWebhookEvent(event: string, data: any) {
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
        await this.create({
          userId: userId,
          bridgecardId: data.card_id,
        });
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
}
