import { Injectable } from '@nestjs/common';
import { BeneficiaryWallet } from './beneficiary-wallet.entity';
import { BeneficiaryWalletRepository } from './beneficiary-wallet.repository';
import { CryptoCurrencyEnum } from '@api/transaction/transaction.types';
import WAValidator = require('multicoin-address-validator');
import { getRawBlockchainForValidation } from '@common/helpers/tools.helper';

@Injectable()
export class BeneficiaryWalletService {
  constructor(private readonly beneficiaryWalletRepository: BeneficiaryWalletRepository) {}

  async findMany(param: Partial<BeneficiaryWallet>) {
    return this.beneficiaryWalletRepository.find({ where: param });
  }

  async findManyForUserBeneficiary(param: Partial<BeneficiaryWallet>) {
    return this.beneficiaryWalletRepository.find({
      where: param,
      select: ['address', 'name', 'type'],
    });
  }

  async create(param: Partial<BeneficiaryWallet>) {
    // Check if beneficiary user already exists
    const beneficiary = await this.beneficiaryWalletRepository.find({ where: param });

    if (beneficiary.length > 0) {
      return false;
    }

    const beneficiaryWalletEntity = await this.beneficiaryWalletRepository.create(param);

    return this.beneficiaryWalletRepository.save(beneficiaryWalletEntity);
  }

  async checkIfExist(params: any): Promise<boolean> {
    const wallets = await this.beneficiaryWalletRepository.findBy(params);

    return wallets.length > 0;
  }

  validateCryptoAddress(blockchain: string | CryptoCurrencyEnum, cryptoAddress: string) {
    //we can't validate Binance Pay ID so we believe customer info without any check
    if (blockchain == CryptoCurrencyEnum.BINANCE) {
      return true;
    }

    const rawBlockchain = getRawBlockchainForValidation(blockchain);

    const valid = WAValidator.validate(cryptoAddress, rawBlockchain, 'prod');

    return valid;
  }
}
