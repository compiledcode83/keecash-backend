import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  BadRequestException,
  Query,
  Patch,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAdminAuthGuard } from '@src/auth/guards/jwt-admin-auth.guard';
import { AccountType } from '@src/user/user.types';
import { UserService } from '@src/user/user.service';
import { AdminService } from './admin.service';
import { AddAdminDto } from './dto/add-admin.dto';
import { GetBeneficiariesDto } from './dto/get-beneficiary-admin.dto';
import { GetCryptoTxAdminDto } from './dto/get-crypto-tx-admin.dto';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { AdminTypeEnum } from './admin.types';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ description: `Get User Info By Filter(email, phone, referral id)` })
  @UseGuards(JwtAdminAuthGuard)
  @Get('user')
  async findUserInfo(@Request() request, @Query('userId') userId: string) {
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
  @Patch('user')
  async updateUserInfo(@Request() request, @Body() body: UpdateUserInfoDto) {
    return this.adminService.updateUserInfo(body);
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
    switch (body.type) {
      case AdminTypeEnum.SuperAdmin:
        return this.adminService.addAdmin(body);
      case AdminTypeEnum.CountryManager:
        break;
      case AdminTypeEnum.CustomerSupport:
        break;
      default:
        break;
    }
  }
}
