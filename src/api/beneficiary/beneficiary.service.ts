import { Injectable } from '@nestjs/common';
import { BeneficiaryUserService } from './beneficiary-user/beneficiary-user.service';
import { BeneficiaryWalletService } from './beneficiary-wallet/beneficiary-wallet.service';
import { BeneficiaryWallet } from './beneficiary-wallet/beneficiary-wallet.entity';

@Injectable()
export class BeneficiaryService {
  constructor(
    private readonly beneficiaryUserService: BeneficiaryUserService,
    private readonly beneficiaryWalletService: BeneficiaryWalletService,
  ) {}

  async findAllByUserId(userId: number, isAdmin = false) {
    const beneficiaryUsers = await this.beneficiaryUserService.findByPayerId(userId, isAdmin);
    const beneficiaryWallets = await this.beneficiaryWalletService.findMany({ userId });

    return {
      users: beneficiaryUsers,
      wallets: beneficiaryWallets,
    };
  }

  async findBeneficiaryWallets(param: Partial<BeneficiaryWallet>) {
    return this.beneficiaryWalletService.findMany(param);
  }
}
