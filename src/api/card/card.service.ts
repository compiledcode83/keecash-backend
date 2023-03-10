import { Injectable } from '@nestjs/common';

@Injectable()
export class CardService {
  constructor() {}

  async findAllPaginated(searchParams: any): Promise<any> {
    return;
    // return this.getPaginatedQueryBuilder({ ...searchParams, userId });
  }
}
