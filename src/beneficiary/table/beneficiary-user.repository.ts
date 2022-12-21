import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BeneficiaryUser } from './beneficiary-user.entity';

@Injectable()
export class BeneficiaryUserRepository extends Repository<BeneficiaryUser> {
  constructor(private readonly dataSource: DataSource) {
    super(BeneficiaryUser, dataSource.manager);
  }
}
