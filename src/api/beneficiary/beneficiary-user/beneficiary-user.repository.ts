import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BeneficiaryUser } from './beneficiary-user.entity';

@Injectable()
export class BeneficiaryUserRepository extends Repository<BeneficiaryUser> {
  constructor(private readonly dataSource: DataSource) {
    super(BeneficiaryUser, dataSource.manager);
  }

  async findByPayerId(payerId: number, isAdmin: boolean) {
    const queryBuilder = this.createQueryBuilder('beneficiary_user').leftJoinAndSelect(
      'beneficiary_user.payee',
      'payee',
    );

    if (!isAdmin) {
      queryBuilder.select([
        `CONCAT(payee.firstName, ' ', payee.secondName) as name`,
        'payee.urlAvatar as url_avatar',
        'payee.referral_id as beneficiary_user_id',
      ]);
    }
    const payees = await queryBuilder.where({ payerId }).getRawMany();

    return payees;
  }
}
