import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CryptoDepositDto } from './dto/crypto-deposit.dto';
import { lastValueFrom, map } from 'rxjs';
import { CryptoPaymentNotifyDto } from './dto/crypto-payment-notify.dto';
import { CryptoTxRepository } from './crypto-tx-repository';
import { CryptoTx, TX_TYPE } from './crypto-tx.entity';
import { UserService } from '@src/user/user.service';
import { CryptoWithdrawDto } from './dto/crypto-withdraw.dto';
import { CryptoConfirmCancelWithdrawDto } from './dto/crypto-confirm-withdraw.dto';
import { CryptoTransferDto } from './dto/crypto-transfer.dto';
import { CryptoTransactionFilterDto } from './dto/crypto-transaction-filter.dto';
import { PaginatedResult } from '@src/common/pagination/pagination.types';
import { LessThan, MoreThan } from 'typeorm';
import { buildPaginator, PagingResult } from 'typeorm-cursor-pagination';
import { FeeService } from '@src/fee/fee.service';

const GRANT_TYPE = 'client_credentials';
const ADMIN_USER_ID = 1;
const OUT_USER_ID = 2;

const CRYPTO_TRIPLEA_FEE_PERCENT = 1;

interface IConfig {
  USD: string;
  EUR: string;
}

@Injectable()
export class CryptoTxService {
  private tripleaClientId: IConfig;
  private tripleaClientSecret: IConfig;
  private tripleaMerchatKey: IConfig;
  private tripleaAccessToken: IConfig;
  private tripleaNotifyUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly cryptoTxRepository: CryptoTxRepository,
    private readonly userService: UserService,
    private readonly feeService: FeeService,
  ) {
    this.tripleaClientId = {
      USD: this.configService.get<string>('cryptoConfig.tripleaUSDClientId'),
      EUR: this.configService.get<string>('cryptoConfig.tripleaEURClientId'),
    };
    this.tripleaClientSecret = {
      USD: this.configService.get<string>(
        'cryptoConfig.tripleaUSDClientSecret',
      ),
      EUR: this.configService.get<string>(
        'cryptoConfig.tripleaEURClientSecret',
      ),
    };
    this.tripleaMerchatKey = {
      USD: this.configService.get<string>('cryptoConfig.tripleaUSDMerchantKey'),
      EUR: this.configService.get<string>('cryptoConfig.tripleaEURMerchantKey'),
    };
    this.tripleaNotifyUrl = this.configService.get<string>(
      'cryptoConfig.tripleaNotifyUrl',
    );
    this.tripleaAccessToken = { USD: '', EUR: '' };
    this.getAccessToken();
  }

  async getBalanceByCurrency(userId: number, currencyName: string) {
    const receivedBalance = await this.cryptoTxRepository
      .createQueryBuilder('crypto_tx')
      .select(['SUM(crypto_tx.amount)'])
      .where(`crypto_tx.user_receiver_id = ${userId}`)
      .andWhere(`crypto_tx.currency_name = 'USD'`)
      .getRawOne();
    const receivedAmount = receivedBalance.sum ? receivedBalance.sum : 0;
    const sentBalance = await this.cryptoTxRepository
      .createQueryBuilder('crypto_tx')
      .select(['SUM(crypto_tx.amount)'])
      .where(`crypto_tx.user_sender_id = ${userId}`)
      .andWhere(`crypto_tx.currency_name = '${currencyName}'`)
      .getRawOne();
    const sentAmount = sentBalance.sum ? sentBalance.sum : 0;

    return receivedAmount - sentAmount;
  }

  async getBalances(userId: number) {
    const receivedBalances = await this.cryptoTxRepository
      .createQueryBuilder('crypto_tx')
      .select(['crypto_tx.currency_name', 'SUM(crypto_tx.amount)'])
      .where(`crypto_tx.user_receiver_id = ${userId}`)
      .groupBy('currency_name')
      .getRawMany();

    const sentBalances = await this.cryptoTxRepository
      .createQueryBuilder('crypto_tx')
      .select(['crypto_tx.currency_name', 'SUM(crypto_tx.amount)'])
      .where(`crypto_tx.user_sender_id = ${userId}`)
      .groupBy('currency_name')
      .getRawMany();

    const balances = [];
    receivedBalances.map((receivedBalance) => {
      for (const sentBalance of sentBalances) {
        if (sentBalance.currency_name === receivedBalance.currency_name) {
          balances.push({
            currency_name: sentBalance.currency_name,
            amount: receivedBalance.sum - sentBalance.sum,
          });
          return;
        }
      }
      balances.push({
        currency_name: receivedBalance.currency_name,
        amount: receivedBalance.sum,
      });
    });

    sentBalances.map((sentBalance) => {
      for (const receivedBalance of receivedBalances) {
        if (sentBalance.currency_name === receivedBalance.currency_name) return;
      }
      balances.push({
        currency_name: sentBalance.currency_name,
        amount: -sentBalance.sum,
      });
    });
    return balances;
  }

  async getAccessToken() {
    for (const currencyName of Object.keys(this.tripleaClientId)) {
      try {
        const requestBody = {
          client_id: this.tripleaClientId[currencyName],
          client_secret: this.tripleaClientSecret[currencyName],
          grant_type: GRANT_TYPE,
        };

        const requestHeader = {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${this.tripleaMerchatKey[currencyName]}`,
        };

        const res = await lastValueFrom(
          this.httpService
            .post('https://api.triple-a.io/api/v2/oauth/token', requestBody, {
              headers: requestHeader,
            })
            .pipe(map((res) => res.data?.access_token)),
        );

        this.tripleaAccessToken[currencyName] = res;
      } catch (err) {
        throw new BadRequestException('Can not get access token');
      }
    }
  }

  async cryptoDeposit(
    body: CryptoDepositDto,
    userEmail: string,
  ): Promise<
    | { hosted_url: string; expires_in: number; payment_reference: string }
    | boolean
  > {
    try {
      const requestBody = {
        type: 'widget',
        merchant_key: this.tripleaMerchatKey[body.currency_name],
        order_currency: body.currency_name,
        order_amount: body.amount,
        payer_id: userEmail,
        notify_url: `${this.tripleaNotifyUrl}/crypto-tx/payment-notifiy`,
      };
      const requestHeader = {
        Authorization: `Bearer ${this.tripleaAccessToken[body.currency_name]}`,
      };
      const res = await lastValueFrom(
        this.httpService
          .post('https://api.triple-a.io/api/v2/payment', requestBody, {
            headers: requestHeader,
          })
          .pipe(map((res) => res.data)),
      );
      return {
        hosted_url: res.hosted_url,
        expires_in: res.expires_in,
        payment_reference: res.payment_reference,
      };
    } catch (err) {
      return false;
    }
  }

  async cryptoWithdraw(
    body: CryptoWithdrawDto,
    userEmail: string,
  ): Promise<
    | {
        fee: number;
        crypto_amount: number;
        exnetwork_fee_crypto_amount: number;
        net_crypto_amount: number;
        payout_reference: string;
        local_currency: string;
        crypto_currency: string;
        exchange_rate: number;
      }
    | boolean
  > {
    const CRYPTO_WITHDRAW_FEE_PERCENT =
      await this.feeService.getCryptoWithdrawFeePercent();
    const CRYPTO_WITHDRAW_FEE_FIXED =
      await this.feeService.getCryptoWithdrawFeeFixed();
    const amount =
      (body.amount * (100 - CRYPTO_WITHDRAW_FEE_PERCENT)) / 100 -
      CRYPTO_WITHDRAW_FEE_FIXED;
    try {
      const requestBody = {
        merchant_key: this.tripleaMerchatKey[body.currency_name],
        email: userEmail,
        withdraw_currency: body.currency_name,
        withdraw_amount: amount,
        crypto_currency: body.crypto_currency_name,
        address: body.address,
        name: body.name,
        country: body.country,
      };
      const requestHeader = {
        Authorization: `Bearer ${this.tripleaAccessToken[body.currency_name]}`,
      };
      const res = await lastValueFrom(
        this.httpService
          .post(
            'https://api.triple-a.io/api/v2/payout/withdraw/local/crypto/direct',
            requestBody,
            {
              headers: requestHeader,
            },
          )
          .pipe(map((res) => res.data)),
      );
      return {
        crypto_amount: res.crypto_amount,
        exnetwork_fee_crypto_amount: res.network_fee_crypto_amount,
        fee: body.amount - amount,
        net_crypto_amount: res.net_crypto_amount,
        payout_reference: res.payout_reference,
        local_currency: res.local_currency,
        crypto_currency: res.crypto_currency,
        exchange_rate: res.exchange_rate,
      };
    } catch (err) {
      return false;
    }
  }

  async cryptoConfirmWithraw(
    body: CryptoConfirmCancelWithdrawDto,
  ): Promise<string> {
    try {
      await lastValueFrom(
        this.httpService
          .put(
            `https://api.triple-a.io/api/v2/payout/withdraw/${body.payout_reference}/local/crypto/confirm`,
          )
          .pipe(map((res) => res.data)),
      );
      return 'Success';
    } catch (err) {
      throw new BadRequestException('Confirm withdraw error');
    }
  }

  async cryptoCancelWithraw(
    body: CryptoConfirmCancelWithdrawDto,
  ): Promise<string> {
    try {
      await lastValueFrom(
        this.httpService
          .put(
            `https://api.triple-a.io/api/v2/payout/withdraw/${body.payout_reference}/local/crypto/cancel`,
          )
          .pipe(map((res) => res.data)),
      );
      return 'Success';
    } catch (err) {
      throw new BadRequestException('Confirm withdraw error');
    }
  }

  async paymentNotify(body: CryptoPaymentNotifyDto) {
    const CRYPTO_DEPOSIT_FEE_PERCENT =
      await this.feeService.getCryptoDepostiFeePercent();
    const CRYPTO_DEPOSIT_FEE_FIXED =
      await this.feeService.getCryptoDepostiFeeFixed();
    const CRYPTO_DEPOSIT_REFERRAL_FEE_PERCENT =
      await this.feeService.getCryptoDepositReferralFeePercent();

    const requestHeader = {
      Authorization: `Bearer ${this.tripleaAccessToken[body.order_currency]}`,
    };

    const res = await lastValueFrom(
      this.httpService
        .get(
          `https://api.triple-a.io/api/v2/payment/${body.payment_reference}`,
          { headers: requestHeader },
        )
        .pipe(map((res) => res.data)),
    );

    if (res.payment_tier === 'good') {
      const userReceiver = await this.userService.findByEmail(res.payer_id);
      {
        const description = `Rates: 1${res.payment_currency}: ${res.exchange_rate}${res.display_crypto_currency}.
        You deposited ${res.order_amount} ${res.payment_currency}.`;
        const receivedAmount =
          res.order_amount -
          (res.order_amount *
            (CRYPTO_DEPOSIT_FEE_PERCENT + CRYPTO_TRIPLEA_FEE_PERCENT)) /
            100 -
          CRYPTO_DEPOSIT_FEE_FIXED;
        const createCryptoTx: Partial<CryptoTx> = {
          userSenderId: OUT_USER_ID,
          userReceiverId: userReceiver.id,
          amount: receivedAmount,
          type: TX_TYPE.DEPOSIT,
          currencyName: res.payment_currency,
          description: description,
          paymentReference: res.payment_reference,
        };
        await this.createCryptoTx(createCryptoTx);
      }

      const referralUserId = await this.userService.getReferralUserId(
        userReceiver.id,
      );
      if (referralUserId) {
        {
          const description = `Fee from ${userReceiver.id}'s deposit`;
          const receivedAmount =
            (((res.order_amount * CRYPTO_DEPOSIT_FEE_PERCENT) / 100 +
              CRYPTO_DEPOSIT_FEE_FIXED) *
              (100 - CRYPTO_DEPOSIT_REFERRAL_FEE_PERCENT)) /
            100;
          const createCryptoTx: Partial<CryptoTx> = {
            userSenderId: OUT_USER_ID,
            userReceiverId: ADMIN_USER_ID,
            amount: receivedAmount,
            type: TX_TYPE.TRANSFER,
            currencyName: res.payment_currency,
            description: description,
            paymentReference: res.payment_reference,
          };
          await this.createCryptoTx(createCryptoTx);
        }

        {
          const description = `Referral deposit`;
          const receivedAmount =
            (((res.order_amount * CRYPTO_DEPOSIT_FEE_PERCENT) / 100 +
              CRYPTO_DEPOSIT_FEE_FIXED) *
              CRYPTO_DEPOSIT_REFERRAL_FEE_PERCENT) /
            100;
          const createCryptoTx: Partial<CryptoTx> = {
            userSenderId: userReceiver.id,
            userReceiverId: referralUserId,
            amount: receivedAmount,
            type: TX_TYPE.TRANSFER,
            currencyName: res.payment_currency,
            description: description,
            paymentReference: res.payment_reference,
          };
          await this.createCryptoTx(createCryptoTx);
        }
      } else {
        const description = `Fee from ${userReceiver.id}'s deposit`;
        const receivedAmount =
          (res.order_amount * CRYPTO_DEPOSIT_FEE_PERCENT) / 100 +
          CRYPTO_DEPOSIT_FEE_FIXED;
        const createCryptoTx: Partial<CryptoTx> = {
          userSenderId: OUT_USER_ID,
          userReceiverId: ADMIN_USER_ID,
          amount: receivedAmount,
          type: TX_TYPE.TRANSFER,
          currencyName: res.payment_currency,
          description: description,
          paymentReference: res.payment_reference,
        };
        await this.createCryptoTx(createCryptoTx);
      }
    }
  }

  async cryptoTransfer(body: CryptoTransferDto, userId: number) {
    const receiver = await this.userService.findByEmailPhonenumberReferralId(
      body.receiver,
    );
    if (receiver) {
      const cryptoTxEntity: Partial<CryptoTx> = {
        userSenderId: userId,
        userReceiverId: receiver.id,
        amount: body.amount,
        currencyName: body.currency_name,
        description: body.description,
      };
      return this.createCryptoTx(cryptoTxEntity);
    }
    throw new BadRequestException('Can not find receiver');
  }

  async createCryptoTx(body: Partial<CryptoTx>): Promise<Partial<CryptoTx>> {
    const cryptoTxEntity = this.cryptoTxRepository.create(body);
    const res = await this.cryptoTxRepository.save(cryptoTxEntity);
    return res;
  }

  async getPaginatedQueryBuilder(
    searchParams: CryptoTransactionFilterDto,
  ): Promise<PaginatedResult<CryptoTx>> {
    const queryBuilder =
      this.cryptoTxRepository.createQueryBuilder('crypto_tx');

    if ('userId' in searchParams) {
      queryBuilder.andWhere({ userSenderId: searchParams.userId });
      queryBuilder.orWhere({ userReceiverId: searchParams.userId });
    }

    if ('currencyName' in searchParams) {
      queryBuilder.andWhere({ currencyName: searchParams.currencyName });
    }

    if ('type' in searchParams) {
      queryBuilder.andWhere({ type: searchParams.type });
    }

    if ('fromDate' in searchParams) {
      queryBuilder.andWhere({
        createdAt: MoreThan(searchParams.fromDate),
      });
    }

    if ('toDate' in searchParams) {
      queryBuilder.andWhere({
        createdAt: LessThan(searchParams.toDate),
      });
    }

    const paginator = buildPaginator({
      entity: CryptoTx,
      alias: 'crypto_tx',
      paginationKeys: ['id', searchParams.orderParam],
      query: {
        limit: searchParams.limit,
        order: searchParams.orderType,
        afterCursor: searchParams.afterCursor,
        beforeCursor: searchParams.beforeCursor,
      },
    });

    return paginator.paginate(queryBuilder);
  }

  async findAllPaginated(
    searchParams: CryptoTransactionFilterDto,
    userId: number,
  ): Promise<PagingResult<CryptoTx>> {
    return this.getPaginatedQueryBuilder({ ...searchParams, userId });
  }

  async getLastTransaction(userId: number): Promise<CryptoTx> {
    const lastTransaction: CryptoTx = await this.cryptoTxRepository
      .createQueryBuilder('crypto_tx')
      .where({ userSenderId: userId })
      .orWhere({ userReceiverId: userId })
      .orderBy('crypto_tx.created_at', 'DESC')
      .getRawOne();
    return lastTransaction;
  }
}
