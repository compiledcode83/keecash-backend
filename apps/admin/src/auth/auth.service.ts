import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfirmEmailVerificationCodeForAdminDto } from '@api/twilio/dto/confirm-email-verification-for-admin.dto';
import { TwilioService } from '@api/twilio/twilio.service';
import { Admin } from '@admin/admin/admin.entity';
import { AdminService } from '@admin/admin/admin.service';
import { AdminAccessTokenInterface } from './admin-auth.type';
import { LoginAdminDto } from './dto/login-admin.dto';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
    private readonly twilioService: TwilioService,
  ) {}

  async login(body: LoginAdminDto) {
    const res = await this.twilioService.sendEmailVerificationCode(body.email);
    if (!res) throw new BadRequestException('Cannot send Security OTP');

    return { msg: 'Security OTP sent your email successfully' };
  }

  async confirmOtpForAdmin(body: ConfirmEmailVerificationCodeForAdminDto): Promise<string> {
    const res = await this.twilioService.confirmEmailVerificationCode(body.email, body.code);
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
