import { Injectable } from '@nestjs/common';
import { BeneficiaryUserService } from './beneficiary-user/beneficiary-user.service';
import { BeneficiaryWalletService } from './beneficiary-wallet/beneficiary-wallet.service';

@Injectable()
export class BeneficiaryService {
  constructor(
    private readonly beneficiaryUserService: BeneficiaryUserService,
    private readonly beneficiaryWalletService: BeneficiaryWalletService,
  ) {}

  async findAllByUserId(userId: number) {
    const beneficiaryUsers = await this.beneficiaryUserService.getByPayerId(userId);
    const beneficiaryWallets = await this.beneficiaryWalletService.getByUserId(userId);

    return {
      users: beneficiaryUsers,
      wallets: beneficiaryWallets,
    };
  }
}
