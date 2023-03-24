import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TransactionStatusEnum } from '@api/transaction/transaction.types';
import { Card } from './card.entity';

@Injectable()
export class CardRepository extends Repository<Card> {
  constructor(private readonly dataSource: DataSource) {
    super(Card, dataSource.manager);
  }

  async getCardsWithBalance(userId: number, withLastTransaction = false) {
    const cards = await this.createQueryBuilder('card')
      .leftJoinAndSelect('card.transaction', 'transaction')
      .where('card.userId = :userId', { userId })
      .select('card')
      .addSelect([
        `SUM(CASE WHEN transaction.status = :status THEN transaction.amount ELSE 0 END) AS balance`,
      ])
      .andWhere('transaction.status = :status', { status: TransactionStatusEnum.Performed })
      .groupBy('card.currency, card.id')
      .orderBy('balance', 'DESC')
      .getRawMany();

    return cards;
  }

  async setBlock(cardId: number, isBlocked: boolean) {
    await this.createQueryBuilder('card')
      .update(Card)
      .set({ isBlocked })
      .where({ id: cardId })
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
      .andWhere('history.status = :status', { status: TransactionStatusEnum.Performed })
      .groupBy('card.currency, card.id')
      .orderBy('balance', 'DESC')
      .getRawMany();

    return result;
  }
}
