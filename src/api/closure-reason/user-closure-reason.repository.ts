import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserClosureReason } from './user-closure-reason.entity';

@Injectable()
export class UserClosureReasonRepository extends Repository<UserClosureReason> {
  constructor(private readonly dataSource: DataSource) {
    super(UserClosureReason, dataSource.manager);
  }

  async getClosureReasonsForUser(userId: number): Promise<{ reason_id: number }[]> {
    const closureReasons = await this.createQueryBuilder('ucr')
      .leftJoinAndSelect('ucr.closureReason', 'cr')
      .where('ucr.user_id = :userId', { userId })
      .select('cr.id AS reason_id')
      .getRawMany();

    return closureReasons;
  }
}
