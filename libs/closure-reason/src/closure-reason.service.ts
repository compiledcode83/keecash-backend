import { Injectable } from '@nestjs/common';
import { UserClosureReasonRepository } from './user-closure-reason.repository';
import closure_reasons from './closure-reasons.json';
import { UserRepository } from '@api/user/user.repository';

@Injectable()
export class ClosureReasonService {
  constructor(
    private readonly userClosureReasonRepository: UserClosureReasonRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async findByUserId(userId: number): Promise<number[]> {
    const closureReasons = await this.userClosureReasonRepository.getClosureReasonsForUser(userId);

    return closureReasons.map((reason) => reason.reason_id);
  }

  async createMany(userId: number, closureReasons: string[]): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });

    const reasonEntities = [];
    const reasonArray = closure_reasons.map((obj) => obj.reason[user.language]);

    for (const reason of closureReasons) {
      const closureReasonId = reasonArray.indexOf(reason) + 1;
      reasonEntities.push({ userId, closureReasonId });
    }

    await this.userClosureReasonRepository.createMany(reasonEntities);
  }
}
