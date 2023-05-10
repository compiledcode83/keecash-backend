import { Injectable } from '@nestjs/common';
// import { UserRepository as CommonRepository } from '@app/user';
import { UserRepository as CommonRepository } from '@app/user/user.repository';
import { User } from '@app/user/user.entity';

@Injectable()
export class UserRepository extends CommonRepository {
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
