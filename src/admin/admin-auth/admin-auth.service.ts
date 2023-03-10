import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfirmEmailVerificationCodeForAdminDto } from '@src/api/user/dto/confirm-email-verification-for-admin.dto';
import { VerificationService } from '@src/api/verification/verification.service';
import { Admin } from '../admin/admin.entity';
import { AdminService } from '../admin/admin.service';
import { AdminAccessTokenInterface } from './admin-auth.type';
import { LoginAdminDto } from './dto/login-admin.dto';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
    private readonly verificationService: VerificationService,
  ) {}

  async login(body: LoginAdminDto) {
    const res = await this.verificationService.sendEmailVerificationCode(body.email);
    if (!res) throw new BadRequestException('Cannot send Security OTP');

    return { msg: 'Security OTP sent your email successfully' };
  }

  async confirmOtpForAdmin(body: ConfirmEmailVerificationCodeForAdminDto): Promise<string> {
    const res = await this.verificationService.confirmEmailVerificationCode(body.email, body.code);
    if (res) {
      const admin = await this.adminService.findAdminByEmail(body.email);
      const accessToken = await this.createAccessToken(admin);

      return accessToken;
    }
    throw new BadRequestException('Invalid code');
  }

  async createAccessToken(admin: Admin): Promise<string> {
    const payload: AdminAccessTokenInterface = {
      id: admin.id,
      email: admin.email,
      type: admin.type,
    };

    return this.jwtService.signAsync(payload);
  }
}
