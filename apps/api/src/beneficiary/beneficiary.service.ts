import { Injectable } from '@nestjs/common';
import { BeneficiaryUserService, BeneficiaryUser } from '@app/beneficiary-user';
import { BeneficiaryWalletService, BeneficiaryWallet } from '@app/beneficiary-wallet';

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

  async createBeneficiaryUser(param: Partial<BeneficiaryUser>) {
    return this.beneficiaryUserService.create(param);
  }

  async createBeneficiaryWallet(param: Partial<BeneficiaryWallet>) {
    return this.beneficiaryWalletService.create(param);
  }
}
