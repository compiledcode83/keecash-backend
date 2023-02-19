import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Query,
  Patch,
  NotFoundException,
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
import { PersonProfileService } from '@src/person-profile/person-profile.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
    private readonly personProfileService: PersonProfileService,
  ) {}

  @ApiOperation({ description: `Get User Info By Filter(email, phone, referral id)` })
  @UseGuards(JwtAdminAuthGuard)
  @Get('user')
  async findUserInfo(@Query('userId') userId: string) {
    const user = await this.userService.findByEmailPhonenumberReferralId(userId);
    if (!user) throw new NotFoundException(`User info ${userId} not found`);

    switch (user.type) {
      case AccountType.Person:
        const userInfo = await this.personProfileService.getPersonUserInfo(user.id);
        if (!userInfo) throw new NotFoundException(`Profile of user ${userId} not found`);

        return userInfo;

      case AccountType.Enterprise:
        break;
    }
  }

  @ApiOperation({
    description: `Update user info`,
  })
  @UseGuards(JwtAdminAuthGuard)
  @Patch('user')
  async updateUserInfo(@Body() body: UpdateUserInfoDto) {
    return this.adminService.updateUserInfo(body);
  }

  @ApiOperation({
    description: `Get Crypto Transactions`,
  })
  @UseGuards(JwtAdminAuthGuard)
  @Get('crypto-tx')
  async getCryptoTx(@Query() query: GetCryptoTxAdminDto) {
    return this.adminService.getCryptoTx(query);
  }

  @ApiOperation({
    description: `Get beneficiary users and wallets`,
  })
  @UseGuards(JwtAdminAuthGuard)
  @Get('beneficiaries')
  async getBeneficiaries(@Query() query: GetBeneficiariesDto) {
    return this.adminService.getBeneficiaries(query.email);
  }

  @ApiOperation({
    description: `Add admin`,
  })
  @UseGuards(JwtAdminAuthGuard)
  @Post('admin')
  async addAdmin(@Body() body: AddAdminDto) {
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
