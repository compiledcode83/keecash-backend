import { BadRequestException, Injectable } from '@nestjs/common';
import { BeneficiaryService } from '@src/beneficiary/beneficiary.service';
import { CryptoTxService } from '@src/crypto-tx/crypto-tx.service';
import { UserService } from '@src/user/user.service';
import { AddAdminDto } from './dto/add-admin.dto';
import { GetCryptoTxAdminDto } from './dto/get-crypto-tx-admin.dto';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { Admin } from './table/admin.entity';
import { AdminRepository } from './table/admin.repository';

@Injectable()
export class AdminService {
  constructor(
    private readonly userService: UserService,
    private readonly cryptoTxService: CryptoTxService,
    private readonly beneficiaryService: BeneficiaryService,
    private readonly adminRepository: AdminRepository,
  ) {}

  async updateUserInfo(body: UpdateUserInfoDto) {
    return this.userService.updatePersonalUser(body);
  }

  async getCryptoTx(body: GetCryptoTxAdminDto) {
    return this.cryptoTxService.findAllPaginated(body, body.userId);
  }

  async getBeneficiaries(email: string) {
    const user = await this.userService.findByEmail(email);
    const beneficiaryUsers = await this.beneficiaryService.getBeneficiaryUsers(user.id);
    const beneficiaryWallets = await this.beneficiaryService.getBeneficiaryWallets(user.id);

    return {
      beneficiaryUsers,
      beneficiaryWallets,
    };
  }

  async validateAdmin(email: string, password: string): Promise<Partial<Admin> | null> {
    return this.adminRepository.validateAdmin(email, password);
  }

  async findAdminByEmail(email: string): Promise<Admin> {
    return this.adminRepository.findOneByEmail(email);
  }

  async addAdmin(body: AddAdminDto): Promise<Admin> {
    return this.adminRepository.addAdmin(body);
  }

  async addNormalAdmin(body: AddAdminDto): Promise<Admin> {
    const admin = await this.addAdmin(body);

    return admin;
  }
}
