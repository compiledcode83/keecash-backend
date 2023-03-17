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
    return this.cardRepository.getCardDetailsByUserId(userId);
  }
}
