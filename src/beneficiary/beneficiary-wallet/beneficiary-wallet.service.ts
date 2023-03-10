import { Injectable } from '@nestjs/common';
import { BeneficiaryWallet } from './beneficiary-wallet.entity';
import { BeneficiaryWalletRepository } from './beneficiary-wallet.repository';
import { AddBeneficiaryWalletDto } from './dto/add-beneficiary-wallet.dto';

@Injectable()
export class BeneficiaryWalletService {
  constructor(private readonly beneficiaryWalletRepository: BeneficiaryWalletRepository) {}

  async getByUserId(userId: number) {
    return this.beneficiaryWalletRepository.getByUserId(userId);
  }

  async addBeneficiaryWallet(body: AddBeneficiaryWalletDto, userId: number): Promise<string> {
    const newBeneficiaryWallet: Partial<BeneficiaryWallet> = {
      userId,
      name: body.name,
      address: body.address,
      type: body.type,
    };
    const beneficiaryWalletEntity = this.beneficiaryWalletRepository.create(newBeneficiaryWallet);
    await this.beneficiaryWalletRepository.save(beneficiaryWalletEntity);

    return 'Success';
  }
}
