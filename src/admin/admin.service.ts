import { BadRequestException, Injectable } from '@nestjs/common';
import { CryptoTxService } from '@src/crypto-tx/crypto-tx.service';
import { ConfirmEmailVerificationCodeDto } from '@src/user/dto/confirm-email-verification.dto';
import { UserService } from '@src/user/user.service';
import { VerificationService } from '@src/verification/verification.service';
import { GetCryptoTxAdminDto } from './dto/get-crypto-tx-admin.dto';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly userService: UserService,
    private readonly verificationService: VerificationService,
    private readonly cryptoTxService: CryptoTxService,
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
}
