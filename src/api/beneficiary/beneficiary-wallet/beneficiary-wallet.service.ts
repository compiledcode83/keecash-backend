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

  async checkIfExist(params: any): Promise<boolean> {
    const wallets = await this.beneficiaryWalletRepository.findBy(params);

    return wallets.length > 0;
  }

  async addBeneficiaryWallet(
    body: AddBeneficiaryWalletDto,
    userId: number,
  ): Promise<BeneficiaryWallet> {
    const walletExists = await this.beneficiaryWalletRepository.findOne({
      where: { userId, address: body.address },
    });

    if (walletExists) {
      throw new BadRequestException(`Wallet ${body.address} already exists`);
    }

    const beneficiaryWallet = await this.beneficiaryWalletRepository.save({
      userId,
      name: body.name,
      address: body.address,
      type: body.type,
    });

    return beneficiaryWallet;
  }
}
