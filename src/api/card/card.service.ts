import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CardRepository } from './card.repository';
import { GetDepositFeeDto } from './dto/get-deposit-fee.dto';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import qs = require('qs');
import { CryptoCurrencyEnum, FiatCurrencyEnum } from '../crypto-tx/crypto-tx.types';
import { GetWithdrawalFeeDto } from './dto/get-withdrawal-fee.dto';
import { GetTransferFeeDto } from './dto/get-transfer-fee.dto';
import { TransactionService } from '../transaction/transaction.service';
import deposit_methods from './deposit_methods.json';
import withdrawal_methods from './withdrawal_methods.json';
import cardTypes from './card_types.json';
import { GetCreateCardTotalFeeDto } from './dto/get-create-card-total-fee.dto';

@Injectable()
export class CardService {
  constructor(
    private readonly cardRepository: CardRepository,
    private readonly transactionService: TransactionService,
  ) {}

  async findAllPaginated(searchParams: any): Promise<any> {
    return;
    // return this.getPaginatedQueryBuilder({ ...searchParams, userId });
  }

  // -------------- MANAGE CARD -------------------

  async getDashboardItemsByUserId(userId: number): Promise<any> {
    const balance = await this.transactionService.getBalanceForUser(userId);

    const cards = await this.cardRepository.getCardsWithBalance(userId);

    const eurCards = cards
      .filter(({ card_currency }) => card_currency === 'EUR')
      .map(({ balance, card_currency, card_card_number, card_name, card_expiry_date }) => ({
        balance,
        currency: card_currency,
        cardNumber: card_card_number,
        name: card_name,
        date: card_expiry_date,
      }));
    const usdCards = cards
      .filter(({ card_currency }) => card_currency === 'USD')
      .map(({ balance, card_currency, card_card_number, card_name, card_expiry_date }) => ({
        balance,
        currency: card_currency,
        cardNumber: card_card_number,
        name: card_name,
        date: card_expiry_date,
      }));

    const result = [
      {
        balance: balance.eur,
        currency: 'EUR',
        cards: eurCards,
      },
      {
        balance: balance.usd,
        currency: 'USD',
        cards: usdCards,
      },
    ];

    return result;
  }

  async getCardListByUserId(userId: number): Promise<any> {
    const cards = await this.cardRepository.getCardsWithBalance(userId, false);

    const result = cards.map((card) => ({
      balance: card.balance,
      currency: card.card_currency,
      isBlock: card.card_is_blocked,
      isExpired: card.card_is_expired,
      cardNumber: card.card_card_number,
      name: card.card_name,
      date: card.card_expiry_date,
      holderLastName: card.card_cardholder_name.split(' ')[-1],
      holderFirstName: card.card_cardholder_name.split(' ')[0],
    }));

    return result;
  }

  async setLock(userId: number, cardId: number, isBlocked: boolean): Promise<void> {
    const card = await this.cardRepository.findOne({ where: { id: cardId } });

    if (card.userId !== userId) {
      throw new UnauthorizedException('Not the owner of the card');
    }

    await this.cardRepository.setBlock(cardId, isBlocked);
  }

  async removeOne(userId: number, cardId: number) {
    const card = await this.cardRepository.findOne({ where: { id: cardId } });

    if (card.userId !== userId) {
      throw new UnauthorizedException('Not the owner of the card');
    }

    await this.cardRepository.softDelete({ id: cardId });
  }

  // -------------- GET SETTINGS -------------------

  async getDepositSettings(userId: number) {
    const balance = await this.transactionService.getBalanceForUser(userId);

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
    const balance = await this.transactionService.getBalanceForUser(userId);

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
    const balance = await this.transactionService.getBalanceForUser(userId);

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

  async getCreateCardSettings(userId: number) {
    const balance = await this.transactionService.getBalanceForUser(userId);

    const keecashWallets = [
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
      keecashWallets,
      cardTypes,
      fixFees: 0.99,
      percentFees: 0.0015,
    };
  }

  async getFeesAppliedTotalToPay(body: GetCreateCardTotalFeeDto) {
    const feesApplied = body.desiredAmount * 0.15 + 0.99;

    const cardPrice = cardTypes.find((card) => card.type === body.cardType).price;

    const totalToPay = cardPrice + body.desiredAmount + feesApplied;

    return { feesApplied, totalToPay };
  }
}
