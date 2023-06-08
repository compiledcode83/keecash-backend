import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(public readonly dataSource: DataSource) {
    super(User, dataSource.manager);
  }

  async findOneWithProfileAndDocuments(
    param: Partial<User>,
    withProfile: boolean,
    withDocuments: boolean,
  ) {
    const queryBuilder = await this.createQueryBuilder('user');

    queryBuilder.leftJoinAndSelect('user.country', 'country');

    if (withProfile) {
      queryBuilder.leftJoinAndSelect('user.personProfile', 'personProfile');
    }

    if (withDocuments) {
      queryBuilder.leftJoinAndSelect('user.documents', 'documents');
    }

    const result = await queryBuilder.where(param).getOne();

    return result;
  }
}
