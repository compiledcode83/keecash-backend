import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.manager);
  }

  async findOneWithProfileAndDocuments(
    param: Partial<User>,
    // userId: number,
    withProfile: boolean,
    withDocuments: boolean,
  ) {
    const queryBuilder = await this.createQueryBuilder('user');

    if (withProfile) {
      queryBuilder
        .leftJoinAndSelect('user.personProfile', 'personProfile')
        .leftJoinAndSelect('personProfile.country', 'country');
    }

    if (withDocuments) {
      queryBuilder.leftJoinAndSelect('user.documents', 'documents');
    }

    const result = await queryBuilder.where(param).getOne();
    // const result = await queryBuilder.where('user.id = :userId', { userId }).getOne();

    return result;
  }
}
