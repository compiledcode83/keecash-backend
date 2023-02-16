import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAdminAuthGuard } from '@src/auth/guards/jwt-admin-auth.guard';
import { AccountType } from '@src/user/table/user.entity';
import { UserService } from '@src/user/user.service';
import { AdminService } from './admin.service';
import { AddAdminDto } from './dto/add-admin.dto';
import { GetBeneficiariesDto } from './dto/get-beneficiary-admin.dto';
import { GetCryptoTxAdminDto } from './dto/get-crypto-tx-admin.dto';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { AdminType } from './table/admin.entity';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({
    description: `Get User Info By Filter(email, phone, referral id)`,
  })
  @UseGuards(JwtAdminAuthGuard)
  @Get('user')
  async findUserInfo(@Request() request, @Query('userId') userId: string) {
    console.log('userId:', userId);
    const user = await this.userService.findByEmailPhonenumberReferralId(userId);
    if (user) {
      if (user.type === AccountType.PERSON) {
        const userInfo = await this.userService.getPersonUserInfo(user.email);
        if (userInfo) return userInfo;
        return {
          id: user.id,
          firstname: user.firstName,
          secondname: user.secondName,
          email: user.email,
          phonenumber: user.phoneNumber,
          referralid: user.referralId,
          referralappliedid: user.referralAppliedId,
          registeredat: user.registeredAt,
          approvedat: user.approvedAt,
          rejectedat: user.rejectedAt,
          status: user.status,
          type: user.type,
          language: user.language,
        };
      }
    }
    throw new BadRequestException('Can not find user');
  }

  @ApiOperation({
    description: `Update user info`,
  })
  @UseGuards(JwtAdminAuthGuard)
  @Post('update_userinfo')
  async updateUserInfo(@Request() request, @Body() body: UpdateUserInfoDto) {
    return await this.adminService.updateUserInfo(body);
  }

  @ApiOperation({
    description: `Get Crypto Transactions`,
  })
  @UseGuards(JwtAdminAuthGuard)
  @Get('crypto-tx')
  async getCryptoTx(@Request() request, @Query() query: GetCryptoTxAdminDto) {
    return this.adminService.getCryptoTx(query);
  }

  @ApiOperation({
    description: `Get beneficiary users and wallets`,
  })
  @UseGuards(JwtAdminAuthGuard)
  @Get('beneficiaries')
  async getBeneficiaries(@Request() request, @Query() query: GetBeneficiariesDto) {
    return this.adminService.getBeneficiaries(query.email);
  }

  @ApiOperation({
    description: `Add admin`,
  })
  @UseGuards(JwtAdminAuthGuard)
  @Post('admin')
  async addAdmin(@Request() request, @Body() body: AddAdminDto) {
    if (body.type === AdminType.SUPER_ADMIN) return this.adminService.addAdmin(body);
    if (body.country) {
    }
  }
}
