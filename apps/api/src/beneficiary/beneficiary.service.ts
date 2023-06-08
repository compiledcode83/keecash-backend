import { Injectable } from '@nestjs/common';
<<<<<<< HEAD:apps/api/src/beneficiary/beneficiary.service.ts
import { BeneficiaryUserService, BeneficiaryUser } from '@app/beneficiary-user';
import { BeneficiaryWalletService, BeneficiaryWallet } from '@app/beneficiary-wallet';
=======
import { BeneficiaryUserService } from './beneficiary-user/beneficiary-user.service';
import { BeneficiaryWalletService } from './beneficiary-wallet/beneficiary-wallet.service';
import { BeneficiaryWallet } from './beneficiary-wallet/beneficiary-wallet.entity';
import { BeneficiaryUser } from './beneficiary-user/beneficiary-user.entity';
import { TypesOfBeneficiary } from './beneficiary.types';
import { CryptoCurrencyEnum } from '@api/transaction/transaction.types';
>>>>>>> 381621e06e83efe140d01ba95f21884ffdfb849c:src/api/beneficiary/beneficiary.service.ts

@Injectable()
export class BeneficiaryService {
  constructor(
    private readonly beneficiaryUserService: BeneficiaryUserService,
    private readonly beneficiaryWalletService: BeneficiaryWalletService,
  ) {}

  async findAllByUserId(userId: number, isAdmin = false) {
    const beneficiaryUsers = await this.beneficiaryUserService.findByPayerId(userId, isAdmin);
    const beneficiaryWallets = await this.beneficiaryWalletService.findManyForUserBeneficiary({
      userId,
    });

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

  getBeneficiaryTypes() {
    return Object.values(TypesOfBeneficiary).filter((v) => isNaN(Number(v)));
  }

  async validateCryptoAddress(
    blockchain: string | CryptoCurrencyEnum,
    cryptoAddress: string,
    userId: number,
  ) {
    return await this.beneficiaryWalletService.validateCryptoAddress(
      blockchain,
      cryptoAddress,
      userId,
    );
  }

  async checkConditionsToAddBeneficiary(beneficiaryId: number, userId: number) {
    return await this.beneficiaryUserService.checkConditionsToAddBeneficiary(beneficiaryId, userId);
  }
}
