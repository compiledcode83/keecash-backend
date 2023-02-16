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

  async addBeneficiaryUser(body: AddBeneficiaryUserDto, userId: number): Promise<string> {
    const beneficiaryUser = await this.userService.findByEmailPhonenumberReferralId(
      body.beneficiaryUser,
    );
    if (beneficiaryUser) {
      const newBeneficiaryUser: Partial<BeneficiaryUser> = {
        userId: beneficiaryUser.id,
        beneficiaryUserId: userId,
      };
      const beneficiaryUserEntity = this.beneficiaryUserRepository.create(newBeneficiaryUser);
      await this.beneficiaryUserRepository.save(beneficiaryUserEntity);
      return 'Success';
    }
    throw new BadRequestException('Can not find beneficiary user');
  }

  async addBeneficiaryWallet(body: AddBeneficiaryWalletDto, userId: number): Promise<string> {
    const newBeneficiaryWallet: Partial<BeneficiaryWallet> = {
      userId: userId,
      name: body.name,
      address: body.address,
      type: body.type,
    };
    const beneficiaryWalletEntity = this.beneficiaryWalletRepository.create(newBeneficiaryWallet);
    await this.beneficiaryWalletRepository.save(beneficiaryWalletEntity);
    return 'Success';
  }

  async getBeneficiaryUsers(userId: number): Promise<BeneficiaryUser[]> {
    const beneficiaryUsers: BeneficiaryUser[] = await this.beneficiaryUserRepository
      .createQueryBuilder('beneficiary_user')
      .innerJoinAndSelect('beneficiary_user.user', 'user')
      .select(['user.first_name', 'user.second_name', 'user.id'])
      .where(`beneficiary_user.beneficiary_user_id = ${userId}`)
      .getRawMany();

    return beneficiaryUsers;
  }

  async getBeneficiaryWallets(userId: number): Promise<BeneficiaryWallet[]> {
    const beneficiaryWallets: BeneficiaryWallet[] = await this.beneficiaryWalletRepository
      .createQueryBuilder('beneficiary_wallet')
      .select(['beneficiary_wallet.type', 'beneficiary_wallet.name', 'beneficiary_wallet.address'])
      .where({ userId: userId })
      .getRawMany();
    return beneficiaryWallets;
  }
}
