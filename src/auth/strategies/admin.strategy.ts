import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminService } from '@src/admin/admin.service';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(private adminService: AdminService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const admin = await this.adminService.validateAdmin(email, password);
    if (!admin) {
      throw new UnauthorizedException();
    }
    return admin;
  }
}
