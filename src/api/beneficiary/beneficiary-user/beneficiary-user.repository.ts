import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BeneficiaryUser } from './beneficiary-user.entity';

@Injectable()
export class BeneficiaryUserRepository extends Repository<BeneficiaryUser> {
  constructor(private readonly dataSource: DataSource) {
    super(BeneficiaryUser, dataSource.manager);
  }

  async getByPayerId(payerId: number) {
    const payees = await this.createQueryBuilder('beneficiary_user')
      .leftJoinAndSelect('beneficiary_user.payee', 'payee')
      .select(['payee.id', 'payee.first_name', 'payee.second_name', 'payee.referral_id'])
      .where({ payerId })
      .getMany();

    return payees;
  }
}
