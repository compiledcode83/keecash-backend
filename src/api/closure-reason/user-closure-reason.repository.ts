import { Injectable } from '@nestjs/common';
import { DataSource, InsertResult, Repository } from 'typeorm';
import { UserClosureReason } from './user-closure-reason.entity';

@Injectable()
export class UserClosureReasonRepository extends Repository<UserClosureReason> {
  constructor(private readonly dataSource: DataSource) {
    super(UserClosureReason, dataSource.manager);
  }

  async createMany(reasonEntities: UserClosureReason[]): Promise<InsertResult> {
    return await this.createQueryBuilder()
      .insert()
      .into(UserClosureReason)
      .values(reasonEntities)
      .execute();
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
