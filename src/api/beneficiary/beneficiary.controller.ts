import { Body, Controller, Post, UseGuards, Get, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { AddBeneficiaryUserDto } from './beneficiary-user/dto/add-beneficiary-user.dto';
import { AddBeneficiaryWalletDto } from './beneficiary-wallet/dto/add-beneficiary-wallet.dto';
import { BeneficiaryUserService } from './beneficiary-user/beneficiary-user.service';
import { BeneficiaryWalletService } from './beneficiary-wallet/beneficiary-wallet.service';
import { BeneficiaryService } from './beneficiary.service';
import { TypesOfBeneficiary } from './beneficiary.types';
import { UserService } from '@api/user/user.service';
import { VerifyWalletAddressDto } from './beneficiary-wallet/dto/verify-wallet-address.dto';
import { VerifyUserExistDto } from './beneficiary-user/dto/verify-user-exist.dto';
import { VerifyUserExistResponseDto } from './beneficiary-user/dto/verify-user-exist-response.dto';
import { VerifyWalletExistResponseDto } from './beneficiary-wallet/dto/verify-wallet-address-response.dto';

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
  async getAllBeneficiaries(@Req() req) {
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
  async verifyUserExist(@Body() body: VerifyUserExistDto): Promise<VerifyUserExistResponseDto> {
    const user = await this.userService.findByEmailPhoneNumberReferralId(body.userField);

    if (user) {
      return { valid: true, beneficiaryUserId: user.referralId };
    } else {
      return { valid: false };
    }
  }

  @ApiOperation({ description: `Verify if crypto address exists` })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('verify-crypto-address')
  async verifyCryptoAddress(
    @Body() body: VerifyWalletAddressDto,
  ): Promise<VerifyWalletExistResponseDto> {
    const doesExist = await this.beneficiaryWalletService.checkIfExist({
      address: body.cryptoAddress,
    });

    return { valid: doesExist };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('add-user')
  async addBeneficiaryUser(@Req() req, @Body() body: AddBeneficiaryUserDto) {
    return this.beneficiaryUserService.addBeneficiaryUser(body, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('add-wallet')
  async addBeneficiaryWallet(@Req() req, @Body() body: AddBeneficiaryWalletDto) {
    return this.beneficiaryWalletService.addBeneficiaryWallet(body, req.user.id);
  }
}
