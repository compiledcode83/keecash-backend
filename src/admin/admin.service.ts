import { Injectable } from '@nestjs/common';
import { ConfirmEmailVerificationCodeDto } from '@src/user/dto/confirm-email-verification.dto';
import { UserService } from '@src/user/user.service';
import { VerificationService } from '@src/verification/verification.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly userService: UserService,
    private readonly verificationService: VerificationService,
  ) {}

  async sendOTPToEmail(email: string): Promise<boolean> {
    return this.verificationService.sendEmailVerificationCode(email);
  }

  async confirmOtp(body: ConfirmEmailVerificationCodeDto): Promise<boolean> {
    return this.verificationService.confirmEmailVerificationCode(body);
  }
}
