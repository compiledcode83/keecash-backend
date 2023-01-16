import { BadRequestException, Injectable } from '@nestjs/common';
import { BeneficiaryService } from '@src/beneficiary/beneficiary.service';
import { CryptoTxService } from '@src/crypto-tx/crypto-tx.service';
import { ConfirmEmailVerificationCodeDto } from '@src/user/dto/confirm-email-verification.dto';
import { UserService } from '@src/user/user.service';
import { VerificationService } from '@src/verification/verification.service';
import { GetBeneficiaryAdminDto } from './dto/get-beneficiary-admin.dto';
import { GetCryptoTxAdminDto } from './dto/get-crypto-tx-admin.dto';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly userService: UserService,
    private readonly verificationService: VerificationService,
    private readonly cryptoTxService: CryptoTxService,
    private readonly beneficiaryService: BeneficiaryService,
  ) {}

  async sendOTPToEmail(email: string): Promise<boolean> {
    return this.verificationService.sendEmailVerificationCode(email);
  }

  async confirmOtp(body: ConfirmEmailVerificationCodeDto): Promise<boolean> {
    return this.verificationService.confirmEmailVerificationCode(body);
  }

  async updateUserInfo(body: UpdateUserInfoDto) {
    return this.userService.updatePersonalUser(body);
  }

  async getCryptoTx(body: GetCryptoTxAdminDto) {
    const user = await this.userService.findByEmail(body.email);
    if (user) return this.cryptoTxService.findAllPaginated(body, user.id);
    throw new BadRequestException('Can not find user');
  }

  async getBeneficiaries(body: GetBeneficiaryAdminDto) {
    const user = await this.userService.findByEmail(body.email);
    const beneficiaryUsers = await this.beneficiaryService.getBeneficiaryUsers(
      user.id,
    );
    const beneficiaryWallets =
      await this.beneficiaryService.getBeneficiaryWallets(user.id);
    return {
      beneficiaryUsers,
      beneficiaryWallets,
    };
  }
}
