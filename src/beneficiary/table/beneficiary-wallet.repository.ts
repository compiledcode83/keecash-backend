import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BeneficiaryWallet } from './beneficiary-wallet.entity';

@Injectable()
export class BeneficiaryWalletRepository extends Repository<BeneficiaryWallet> {
  constructor(private readonly dataSource: DataSource) {
    super(BeneficiaryWallet, dataSource.manager);
  }
}
