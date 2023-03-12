import { Body, Request, Controller, Post, UseGuards, Get, NotFoundException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { AddBeneficiaryUserDto } from './beneficiary-user/dto/add-beneficiary-user.dto';
import { AddBeneficiaryWalletDto } from './beneficiary-wallet/dto/add-beneficiary-wallet.dto';
import { BeneficiaryUserService } from './beneficiary-user/beneficiary-user.service';
import { BeneficiaryWalletService } from './beneficiary-wallet/beneficiary-wallet.service';
import { BeneficiaryService } from './beneficiary.service';
import { TypesOfBeneficiary } from './beneficiary.types';
import { UserService } from '@api/user/user.service';

@Controller()
@ApiTags('Manage beneficiaries')
export class BeneficiaryController {
  constructor(
    private readonly beneficiaryService: BeneficiaryService,
    private readonly beneficiaryUserService: BeneficiaryUserService,
    private readonly beneficiaryWalletService: BeneficiaryWalletService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ description: `Get all beneficiary users and wallets` })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('all')
  async getAllBeneficiaries(@Request() req) {
    return this.beneficiaryService.findAllByUserId(req.user.id);
  }

  @ApiOperation({ description: `Get all types of beneficiary wallet` })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('types')
  async getBeneficiaryTypes() {
    //TODO: Modify this to Object.values(<enum>);
    const types = TypesOfBeneficiary;

    return types;
  }

  @ApiOperation({ description: `Verify if user exists` })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('verify-user-exist')
  async verifyUserExist(@Body('userField') userField: string) {
    const user = await this.userService.findByEmailPhoneNumberReferralId(userField);

    if (!user) throw new NotFoundException(`User not found with info ${userField}`);

    return { valid: true, beneficiaryUserId: user.referralId };
  }

  @ApiOperation({ description: `Verify if crypto address exists` })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('verify-crypto-address')
  async verifyCryptoAddress(@Body() body) {
    const { data } = body;

    return;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('add-user')
  async addBeneficiaryUser(@Body() body: AddBeneficiaryUserDto, @Request() req) {
    return this.beneficiaryUserService.addBeneficiaryUser(body, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('add-wallet')
  async addBeneficiaryWallet(@Body() body: AddBeneficiaryWalletDto, @Request() req) {
    return this.beneficiaryWalletService.addBeneficiaryWallet(body, req.user.id);
  }
}
