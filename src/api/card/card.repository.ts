import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CardTxStatusEnum } from '../card-history/card-history.types';
import { Card } from './card.entity';
import { CardHistory } from '../card-history/card-history.entity';

@Injectable()
export class CardRepository extends Repository<Card> {
  constructor(private readonly dataSource: DataSource) {
    super(Card, dataSource.manager);
  }

  async getCardDetailsByUserId(userId: number) {
    const result = await this.createQueryBuilder('card')
      .leftJoinAndSelect('card.history', 'history')
      .where('card.userId = :userId', { userId })
      .select([
        `card.currency AS currency`,
        `SUM(CASE WHEN history.status = :status THEN history.amount ELSE 0 END) AS balance`,
        `logo`,
        `card_number AS cardNumber`,
        `name`,
        'expiry_date AS date',
      ])
      .andWhere('history.status = :status', { status: CardTxStatusEnum.Performed })
      .groupBy('card.currency, card.id')
      .orderBy('balance', 'DESC')
      .getRawMany();

    return result;
  }

  async getCardsDetailWithLastTransaction(userId: number) {
    // const result = await this.createQueryBuilder('card')
    //   .leftJoinAndSelect('card.history', 'history')
    //   .where('card.userId = :userId', { userId })
    //   .addSelect((subQuery) => {
    //     return subQuery
    //       .select('MAX(history.createdAt)', 'lastTransactionDate')
    //       .addSelect('MAX(history.amount)', 'lastTransactionAmount')
    //       .from(CardHistory, 'history')
    //       .where('history.card_id = card.id');
    //   }, 'last_transaction')
    //   .select([
    //     `card.currency AS currency`,
    //     `SUM(CASE WHEN history.status = :status THEN history.amount ELSE 0 END) AS balance`,
    //     `logo`,
    //     `card_number AS cardNumber`,
    //     `name`,
    //     'expiry_date AS date',
    //     'last_transaction.lastTransactionDate as lastTransactionDate',
    //     'last_transaction.lastTransactionAmount as lastTransactionAmount',
    //   ])
    //   .andWhere('history.status = :status', { status: CardTxStatusEnum.Performed })
    //   .groupBy('card.currency, card.id')
    //   .orderBy('balance', 'DESC')
    //   .getRawMany();

    const result = await this.createQueryBuilder('card')
      .leftJoinAndSelect('card.history', 'history')
      .where('card.userId = :userId', { userId })
      .select([
        `SUM(CASE WHEN history.status = :status THEN history.amount ELSE 0 END) AS balance`,
        `card.currency AS currency`,
        'is_blocked AS isBlocked',
        'is_expired AS isExpired',
        `card_number AS cardNumber`,
        `name`,
        'expiry_date AS date',
      ])
      .andWhere('history.status = :status', { status: CardTxStatusEnum.Performed })
      .groupBy('card.currency, card.id')
      .orderBy('balance', 'DESC')
      .getRawMany();

    return result;
  }

  async blockByUserId(userId: number, isBlocked: boolean) {
    await this.createQueryBuilder('card')
      .update(Card)
      .set({ isBlocked })
      .where({ userId })
      .execute();
  }

  async getBalancesForAllCurrencies(userId: number) {
    const result = await this.createQueryBuilder('card')
      .leftJoinAndSelect('card.history', 'history')
      .where('card.userId = :userId', { userId })
      .select([
        `card.currency AS currency`,
        `SUM(CASE WHEN history.status = :status THEN history.amount ELSE 0 END) AS balance`,
      ])
      .andWhere('history.status = :status', { status: CardTxStatusEnum.Performed })
      .groupBy('card.currency, card.id')
      .orderBy('balance', 'DESC')
      .getRawMany();

    return result;
  }
}
