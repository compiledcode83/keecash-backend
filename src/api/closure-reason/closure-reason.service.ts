import { Injectable } from '@nestjs/common';
import { UserClosureReasonRepository } from './user-closure-reason.repository';

@Injectable()
export class ClosureReasonService {
  constructor(private readonly userClosureReasonRepository: UserClosureReasonRepository) {}

  async getClosureReasonsByUserId(userId: number): Promise<number[]> {
    const closureReasons = await this.userClosureReasonRepository.getClosureReasonsForUser(userId);

    return closureReasons.map((reason) => reason.reason_id);
  }
}
