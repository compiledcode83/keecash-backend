import { Injectable } from '@nestjs/common';
import { BeneficiaryWallet } from './beneficiary-wallet.entity';
import { BeneficiaryWalletRepository } from './beneficiary-wallet.repository';
import { CryptoCurrencyEnum } from '@api/transaction/transaction.types';
import WAValidator = require('multicoin-address-validator');
import { ToolsHelper } from '@common/helpers/tools.helper';

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

  async validateCryptoAddress(
    blockchain: string | CryptoCurrencyEnum,
    cryptoAddress: string,
    userId: number,
  ) {
    const rawBlockchain = ToolsHelper.getRawBlockchainForValidation(blockchain);

    //------------------------------------------------------------------------
    // - condition 1 : we check if address is acceptable with the crypto method
    //------------------------------------------------------------------------
    let isCryptoWalletOK = false;
    //we can't validate Binance Pay ID so we believe customer info without any check
    if (blockchain == CryptoCurrencyEnum.BINANCE) {
      isCryptoWalletOK = true;
    } else {
      isCryptoWalletOK = WAValidator.validate(cryptoAddress, rawBlockchain, 'prod');
    }

    //------------------------------------------------------------------------
    // - condition 2 : Is this wallet not already saved by the user?
    //------------------------------------------------------------------------
    const isCryptoWalletAlreadySave = await this.checkIfExist({ address: cryptoAddress, userId });

    //end
    return { isCryptoWalletOK, isCryptoWalletAlreadySave };
  }
}
