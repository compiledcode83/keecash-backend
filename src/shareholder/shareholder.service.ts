import { Injectable } from '@nestjs/common';
import { Shareholder } from './shareholder.entity';
import { ShareholderRepository } from './shareholder.repository';

@Injectable()
export class ShareholderService {
  constructor(private readonly shareholderRepository: ShareholderRepository) {}

  async save(shareholder: Partial<Shareholder>): Promise<void> {
    const shareholderEntity = this.shareholderRepository.create(shareholder);

    await this.shareholderRepository.save(shareholderEntity);
  }
}
