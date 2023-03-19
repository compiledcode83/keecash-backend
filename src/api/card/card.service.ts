import { Injectable } from '@nestjs/common';
import { CardRepository } from './card.repository';

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
}
