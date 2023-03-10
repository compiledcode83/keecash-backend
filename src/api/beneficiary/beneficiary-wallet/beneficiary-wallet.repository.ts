import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BeneficiaryWallet } from './beneficiary-wallet.entity';

@Injectable()
export class BeneficiaryWalletRepository extends Repository<BeneficiaryWallet> {
  constructor(private readonly dataSource: DataSource) {
    super(BeneficiaryWallet, dataSource.manager);
  }

  async getByUserId(userId: number) {
    const beneficiaryWallets = await this.createQueryBuilder('beneficiary_wallet')
      .select(['beneficiary_wallet.type', 'beneficiary_wallet.name', 'beneficiary_wallet.address'])
      .where({ userId })
      .getMany();

    return beneficiaryWallets;
  }
}
