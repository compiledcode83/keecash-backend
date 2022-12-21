import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '@src/user/user.service';
import { AddBeneficiaryUserDto } from './dto/add-beneficiary-user.dto';
import { AddBeneficiaryWalletDto } from './dto/add-beneficiary-wallet.dto';
import { BeneficiaryUser } from './table/beneficiary-user.entity';
import { BeneficiaryUserRepository } from './table/beneficiary-user.repository';
import { BeneficiaryWallet } from './table/beneficiary-wallet.entity';
import { BeneficiaryWalletRepository } from './table/beneficiary-wallet.repository';

@Injectable()
export class BeneficiaryService {
  constructor(
    private readonly beneficiaryWalletRepository: BeneficiaryWalletRepository,
    private readonly beneficiaryUserRepository: BeneficiaryUserRepository,
    private readonly userService: UserService,
  ) {}

  async addBeneficiaryUser(body: AddBeneficiaryUserDto, userId: number) {
    const beneficiaryUser =
      await this.userService.findByEmailPhonenumberReferralId(
        body.beneficiaryUser,
      );
    if (beneficiaryUser) {
      const newBeneficiaryUser: Partial<BeneficiaryUser> = {
        userId: userId,
        beneficiaryUserId: beneficiaryUser.id,
      };
      const beneficiaryUserEntity =
        this.beneficiaryUserRepository.create(newBeneficiaryUser);
      await this.beneficiaryUserRepository.save(beneficiaryUserEntity);
      return 'Success';
    }
    throw new BadRequestException('Can not find beneficiary user');
  }

  async addBeneficiaryWallet(body: AddBeneficiaryWalletDto, userId: number) {
    const newBeneficiaryWallet: Partial<BeneficiaryWallet> = {
      userId: userId,
      name: body.name,
      address: body.address,
      type: body.type,
    };
    const beneficiaryWalletEntity =
      this.beneficiaryWalletRepository.create(newBeneficiaryWallet);
    await this.beneficiaryWalletRepository.save(beneficiaryWalletEntity);
    return 'Success';
  }
}
