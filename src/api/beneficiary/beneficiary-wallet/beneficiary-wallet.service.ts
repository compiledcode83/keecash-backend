import { BadRequestException, Injectable } from '@nestjs/common';
import { BeneficiaryWallet } from './beneficiary-wallet.entity';
import { BeneficiaryWalletRepository } from './beneficiary-wallet.repository';
import { AddBeneficiaryWalletDto } from './dto/add-beneficiary-wallet.dto';

@Injectable()
export class BeneficiaryWalletService {
  constructor(private readonly beneficiaryWalletRepository: BeneficiaryWalletRepository) {}

  async findMany(param: Partial<BeneficiaryWallet>) {
    return this.beneficiaryWalletRepository.find({ where: param });
  }

  async create(param: Partial<BeneficiaryWallet>): Promise<BeneficiaryWallet> {
    const beneficiaryWalletEntity = await this.beneficiaryWalletRepository.create(param);

    return this.beneficiaryWalletRepository.save(beneficiaryWalletEntity);
  }

  async checkIfExist(params: any): Promise<boolean> {
    const wallets = await this.beneficiaryWalletRepository.findBy(params);

    return wallets.length > 0;
  }
}
