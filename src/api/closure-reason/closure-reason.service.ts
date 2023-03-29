import { Injectable } from '@nestjs/common';
import { UserClosureReasonRepository } from './user-closure-reason.repository';

const closure_reasons = require('./closure-reasons.json');

@Injectable()
export class ClosureReasonService {
  constructor(private readonly userClosureReasonRepository: UserClosureReasonRepository) {}

  async findByUserId(userId: number): Promise<number[]> {
    const closureReasons = await this.userClosureReasonRepository.getClosureReasonsForUser(userId);

    return closureReasons.map((reason) => reason.reason_id);
  }

  async createMany(userId: number, closureReasons: string[]): Promise<void> {
    const reasonEntities = [];
    const reasonArray = closure_reasons.map((obj) => obj.reason);

    for (const reason of closureReasons) {
      const closureReasonId = reasonArray.indexOf(reason) + 1;
      reasonEntities.push({ userId, closureReasonId });
    }

    await this.userClosureReasonRepository.createMany(reasonEntities);
  }
}
