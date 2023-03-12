import { Injectable } from '@nestjs/common';
import { BeneficiaryUserService } from './beneficiary-user/beneficiary-user.service';
import { BeneficiaryWalletService } from './beneficiary-wallet/beneficiary-wallet.service';

@Injectable()
export class BeneficiaryService {
  constructor(
    private readonly beneficiaryUserService: BeneficiaryUserService,
    private readonly beneficiaryWalletService: BeneficiaryWalletService,
  ) {}

  async findAllByUserId(userId: number, isAdmin = false) {
    const beneficiaryUsers = await this.beneficiaryUserService.findByPayerId(userId, isAdmin);
    const beneficiaryWallets = await this.beneficiaryWalletService.findByUserId(userId);

    return {
      users: beneficiaryUsers,
      wallets: beneficiaryWallets,
    };
  }
}
