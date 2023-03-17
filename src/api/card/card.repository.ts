import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CardTxStatusEnum } from '../card-history/card-history.types';
import { Card } from './card.entity';

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
}
