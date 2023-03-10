import { BadRequestException, Injectable } from '@nestjs/common';
import { CryptoTxService } from '@api/crypto-tx/crypto-tx.service';
import { UserService } from '@api/user/user.service';
import { AddAdminDto } from './dto/add-admin.dto';
import { GetCryptoTxAdminDto } from './dto/get-crypto-tx-admin.dto';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { Admin } from './admin.entity';
import { AdminRepository } from './admin.repository';
import { AdminFilterDto } from './dto/admin.filter.dto';
import { PagingResult } from 'typeorm-cursor-pagination';
import { BeneficiaryUserService } from '@api/beneficiary/beneficiary-user/beneficiary-user.service';
import { BeneficiaryWalletService } from '@api/beneficiary/beneficiary-wallet/beneficiary-wallet.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly userService: UserService,
    private readonly cryptoTxService: CryptoTxService,
    private readonly beneficiaryUserService: BeneficiaryUserService,
    private readonly beneficiaryWalletService: BeneficiaryWalletService,
    private readonly adminRepository: AdminRepository,
  ) {}

  async findAllPaginated(searchParams: AdminFilterDto): Promise<PagingResult<Admin>> {
    return this.adminRepository.getPaginatedQueryBuilder(searchParams);
  }

  async updateUserInfo(body: UpdateUserInfoDto) {
    return this.userService.updatePersonalUser(body);
  }

  async getCryptoTx(body: GetCryptoTxAdminDto) {
    return this.cryptoTxService.findAllPaginated(body);
  }

  // async getBeneficiaries(email: string) {
  //   const user = await this.userService.findByEmail(email);
  //   const beneficiaryUsers = await this.beneficiaryUserService.getByPayerId(user.id);
  //   const beneficiaryWallets = await this.beneficiaryWalletService.getBeneficiaryWallets(user.id);

  //   return {
  //     beneficiaryUsers,
  //     beneficiaryWallets,
  //   };
  // }

  async validateAdmin(email: string, password: string): Promise<Partial<Admin> | null> {
    return this.adminRepository.validateAdmin(email, password);
  }

  async findAdminByEmail(email: string): Promise<Admin> {
    return this.adminRepository.findOneByEmail(email);
  }

  async addAdmin(body: AddAdminDto): Promise<Admin> {
    return this.adminRepository.addAdmin(body);
  }

  async deleteAdmin(id: number) {
    return this.adminRepository.softDelete({ id });
  }

  async addNormalAdmin(body: AddAdminDto): Promise<Admin> {
    const admin = await this.addAdmin(body);

    return admin;
  }
}
