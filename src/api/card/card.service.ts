import { Injectable } from '@nestjs/common';
import { CardRepository } from './card.repository';
import { GetDepositFeeDto } from './dto/get-deposit-fee.dto';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import qs = require('qs');
import { CryptoCurrencyEnum } from '../crypto-tx/crypto-tx.types';
import { GetWithdrawalFeeDto } from './dto/get-withdrawal-fee.dto';

@Injectable()
export class CardService {
  constructor(private readonly cardRepository: CardRepository) {}

  async findAllPaginated(searchParams: any): Promise<any> {
    return;
    // return this.getPaginatedQueryBuilder({ ...searchParams, userId });
  }

  async getCardDetailsByUserId(userId: number): Promise<any> {
    const cards = await this.cardRepository.getCardDetailsByUserId(userId);

    let usdTotal = 0;
    let eurTotal = 0;

    const usdCards = [];
    const eurCards = [];

    for (const card of cards) {
      switch (card.currency) {
        case 'USD':
          usdTotal += card.balance;
          usdCards.push(card);
          break;

        case 'EUR':
          eurTotal += card.balance;
          eurCards.push(card);
          break;
      }
    }

    const result = [
      { balance: usdTotal, currency: 'USD', cards: usdCards },
      { balance: eurTotal, currency: 'EUR', cards: eurCards },
    ];

    return result;
  }

  async getCardListByUserId(userId: number): Promise<any> {
    const cards = await this.cardRepository.getCardsDetailWithLastTransaction(userId);

    return cards;
  }

  async setLockByUserId(userId: number, isBlocked: boolean): Promise<void> {
    await this.cardRepository.blockByUserId(userId, isBlocked);
  }

  async removeByUserId(userId: number) {
    await this.cardRepository.softDelete({ userId });
  }

  async getDepositSettings(userId: number) {
    const cards = await this.cardRepository.getBalancesForAllCurrencies(userId);

    let eurBalance = 0;
    let usdBalance = 0;

    cards.map((card) => {
      if (card.currency === 'EUR') eurBalance += card.balance;
      if (card.currency === 'USD') usdBalance += card.balance;
    });

    return {
      keecash_wallets: [
        {
          currency: 'EUR',
          balance: eurBalance,
          is_checked: true,
          min: 0,
          max: 100000,
          after_decimal: 2,
        },
        {
          currency: 'USD',
          balance: usdBalance,
          is_checked: false,
          min: 0,
          max: 100000,
          after_decimal: 2,
        },
      ],
      deposit_methods: [
        {
          name: 'Bitcoin',
          code: 'BTC',
          exchange_rate: [
            // same size than keecash_wallets and ordonnate in the same currency fiat
            '15000', // EUR
            '14500', // USD
          ],
          is_checked: 'false',
          min: '0',
          max: '10',
          after_decimal: '6',
        },
        {
          name: 'Bitcoin Lightning',
          code: 'BTC_LIGHTNING',
          exchange_rate: [
            // same size than keecash_wallets and ordonnate in the same currency fiat
            '15000', // EUR
            '14500', // USD
          ],
          is_checked: 'false',
          min: '0',
          max: '10',
          after_decimal: '6',
        },
        {
          name: 'Ethereum',
          code: 'ETH',
          exchange_rate: [
            // same size than keecash_wallets and ordonnate in the same currency fiat
            '1500', // EUR
            '1450', // USD
          ],
          is_checked: 'false',
          min: '0',
          max: '200',
          after_decimal: '4',
        },
        {
          name: 'Tether USD (TRC20)',
          code: 'USDT_TRC20',
          exchange_rate: [
            // same size than keecash_wallets and ordonnate in the same currency fiat
            '1.121', // EUR
            '0.994', // USD
          ],
          is_checked: 'false',
          min: '0',
          max: '100000',
          after_decimal: '2',
        },
        {
          name: 'Tether USD (ERC20)',
          code: 'USDT_ERC20',
          exchange_rate: [
            // same size than keecash_wallets and ordonnate in the same currency fiat
            '1.121', // EUR
            '0.994', // USD
          ],
          is_checked: 'false',
          min: '0',
          max: '100000',
          after_decimal: '2',
        },
        {
          name: 'USD Coin',
          code: 'USDC',
          exchange_rate: [
            // same size than keecash_wallets and ordonnate in the same currency fiat
            '1.121', // EUR
            '0.994', // USD
          ],
          is_checked: 'false',
          min: '0',
          max: '100000',
          after_decimal: '2',
        },
        {
          name: 'Binance Pay',
          code: 'BINANCE',
          exchange_rate: [
            // same size than keecash_wallets and ordonnate in the same currency fiat
            '1.121', // EUR
            '0.994', // USD
          ],
          is_checked: 'false',
          min: '0',
          max: '100000',
          after_decimal: '2',
        },
      ],
      fix_fees: '0.99',
      percent_fees: '0.01',
    };
  }

  async getWithdrawalSettings(userId: number) {
    const cards = await this.cardRepository.getBalancesForAllCurrencies(userId);

    let eurBalance = 0;
    let usdBalance = 0;

    cards.map((card) => {
      if (card.currency === 'EUR') eurBalance += card.balance;
      if (card.currency === 'USD') usdBalance += card.balance;
    });

    return {
      keecash_wallets: [
        {
          currency: 'EUR',
          balance: eurBalance,
          is_checked: true,
          min: 0,
          max: eurBalance,
          after_decimal: 2,
        },
        {
          currency: 'USD',
          balance: usdBalance,
          is_checked: false,
          min: 0,
          max: usdBalance,
          after_decimal: 2,
        },
      ],
      withdrawal_methods: [
        {
          name: 'Bitcoin',
          code: 'BTC',
          exchange_rate: [
            // same size than keecash_wallets and ordonnate in the same currency fiat
            '15000', // EUR
            '14500', // USD
          ],
          is_checked: 'false',
          min: '0',
          max: '10',
          after_decimal: '6',
        },
        {
          name: 'Bitcoin Lightning',
          code: 'BTC_LIGHTNING',
          exchange_rate: [
            // same size than keecash_wallets and ordonnate in the same currency fiat
            '15000', // EUR
            '14500', // USD
          ],
          is_checked: 'false',
          min: '0',
          max: '10',
          after_decimal: '6',
        },
        {
          name: 'Ethereum',
          code: 'ETH',
          exchange_rate: [
            // same size than keecash_wallets and ordonnate in the same currency fiat
            '1500', // EUR
            '1450', // USD
          ],
          is_checked: 'false',
          min: '0',
          max: '200',
          after_decimal: '4',
        },
        {
          name: 'Tether USD (TRC20)',
          code: 'USDT_TRC20',
          exchange_rate: [
            // same size than keecash_wallets and ordonnate in the same currency fiat
            '1.121', // EUR
            '0.994', // USD
          ],
          is_checked: 'false',
          min: '0',
          max: '100000',
          after_decimal: '2',
        },
        {
          name: 'Tether USD (ERC20)',
          code: 'USDT_ERC20',
          exchange_rate: [
            // same size than keecash_wallets and ordonnate in the same currency fiat
            '1.121', // EUR
            '0.994', // USD
          ],
          is_checked: 'false',
          min: '0',
          max: '100000',
          after_decimal: '2',
        },
        {
          name: 'USD Coin',
          code: 'USDC',
          exchange_rate: [
            // same size than keecash_wallets and ordonnate in the same currency fiat
            '1.121', // EUR
            '0.994', // USD
          ],
          is_checked: 'false',
          min: '0',
          max: '100000',
          after_decimal: '2',
        },
        {
          name: 'Binance Pay',
          code: 'BINANCE',
          exchange_rate: [
            // same size than keecash_wallets and ordonnate in the same currency fiat
            '1.121', // EUR
            '0.994', // USD
          ],
          is_checked: 'false',
          min: '0',
          max: '100000',
          after_decimal: '2',
        },
      ],
      fix_fees: '0.99',
      percent_fees: '0.01',
    };
  }

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

  // async requestCryptoPaymentTripleA(data: {
  //   amount: number;
  //   notify_url: string;
  //   cryptoCode: string;
  //   keecashWalletCurrency: string;
  // }): Promise<{ hosted_url: string }> {
  //   try {
  //     const getAccessTokenTripleA = async (): Promise<string> => {
  //       try {
  //         // console.log(`getAccessTokenTripleA BEGIN`)
  //         const OACID_TRIPLEA = `oacid-clbpnbrm2000b08mzgs238wil`;
  //         const OACID_TRIPLEA_SECRET = `c2cc2e1204787daf68987024314bfa1a80845b2e4f6bac1b180aeec98a7c90a6`;
  //         const configToken: AxiosRequestConfig = {
  //           url: 'https://api.triple-a.io/api/v2/oauth/token',
  //           method: 'post',
  //           baseURL: 'https://api.triple-a.io/api/v2',
  //           headers: {
  //             Authorization: `Basic ${Buffer.from(
  //               `${OACID_TRIPLEA}:${OACID_TRIPLEA_SECRET}`,
  //             ).toString('base64')}`,
  //             'Content-Type': 'application/x-www-form-urlencoded',
  //           },
  //           data: qs.stringify({
  //             grant_type: 'client_credentials',
  //             scope: 'client-credentials',
  //           }),
  //         };
  //         const responseToken: {
  //           access_token: string;
  //           token_type: string;
  //           expires_in: number;
  //           scope: string;
  //         } = (await axios(configToken)).data;

  //         return responseToken.access_token;
  //       } catch (error) {
  //         if (axios.isAxiosError(error)) {
  //           const erroAxios = error as AxiosError;
  //           // console.log(JSON.stringify(erroAxios.response?.data))
  //           throw new Error(JSON.stringify(erroAxios.response?.data));
  //         } else {
  //           console.log(error);
  //         }
  //         throw error;
  //       }
  //     };

  //     const dataToSend = {
  //       type: 'widget',
  //       merchant_key: 'mkey-cl2ixigsy2pytslthh0k62nq4',
  //       order_currency: data.keecashWalletCurrency,
  //       order_amount: data.amount,
  //       notify_email: 'log@keecash.com',
  //       notify_url: data.notify_url, // "https://webhook.site/1eef5dd1-b489-446e-9299-01649392c630",
  //       notify_secret: 'n962ETvA3Ex7c0ENNtj3',
  //       notify_txs: true,
  //       payer_id: `dZ5Ja2yRXcQBjHOnWU2HGXz0Lir1`,
  //       payer_name: 'Hol Chancelvy MAYISSA BOUSSAMBA',
  //       payer_email: 'hol.mayissa@keecash.com', // `hol.mayissa@keecash.com`,
  //       // "payer_phone": data.phoneTypedE164, //comme il est possible que le client n'ait pas de phoneTypedE164 au moment de la recharge par crypto autant on hide ici
  //       payer_address: '11 rue Jeanne Labbé Lesourd',
  //       payer_poi: `https://firebasestorage.googleapis.com/v0/b/keecash-8b2cc.appspot.com/o/users%2FdZ5Ja2yRXcQBjHOnWU2HGXz0Lir1%2Fpassport_0?alt=media&token=6e9a6fb1-f44f-4054-9d40-4276912d318b`,
  //       // "success_url": `${host}/dashboard/new-transaction/${data.transactionType}/execute/ok`, // test possible via ngRok par exemple
  //       // "cancel_url": `${host}//dashboard/new-transaction/${data.transactionType}/execute/ko`,
  //       cart: {
  //         items: [
  //           {
  //             sku: 'KCXXXX',
  //             label: 'Deposit',
  //             quantity: 1,
  //             amount: data.amount,
  //           },
  //         ],
  //         shipping_cost: 0,
  //         shipping_discount: 0,
  //         tax_cost: 0,
  //       },
  //       webhook_data: {
  //         uid: `dZ5Ja2yRXcQBjHOnWU2HGXz0Lir1`,
  //         transaction_type: 'deposit', // "crypto-withdrawal",
  //       },
  //     };

  //     const dataIn = JSON.stringify(dataToSend);

  //     const getSpecificAccount = (cryptoIn: string) => {
  //       switch (cryptoIn) {
  //         case 'BTC':
  //           return 'HA1671142886hsEOKCgVJ5';
  //         case 'BTC_LIGHTNING':
  //           return 'LNBC16711428867SN7UZxg';
  //         case 'ETH':
  //           return 'ETH1671142886nuUUdiQ3x';
  //         case 'USDC':
  //           return 'USDC1671142886Ef3KXn19';
  //         case 'USDT_ERC20':
  //           return 'USDT1671142886UsWkDKEI';
  //         case 'USDT_TRC20':
  //           return 'USDTTRC2016711428863jy';
  //         case 'BINANCE':
  //           return 'BINANCE1671142886hitdD';
  //         default:
  //           return '';
  //       }
  //     };

  //     const config = {
  //       method: 'post',
  //       url: `https://api.triple-a.io/api/v2/payment/account/${getSpecificAccount(
  //         data.cryptoCode,
  //       )}`,
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${await getAccessTokenTripleA()}`,
  //       },
  //       data: dataIn,
  //     };
  //     // console.log(`CALL TRIPLE A BEGIN`)
  //     // console.log(config)

  //     const response = await axios(config);

  //     return { hosted_url: response.data.hosted_url };
  //   } catch (e) {
  //     throw e;
  //   }
  // }
}
