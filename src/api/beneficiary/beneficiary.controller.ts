import { Body, Controller, Post, UseGuards, Get, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { AddBeneficiaryUserDto } from './beneficiary-user/dto/add-beneficiary-user.dto';
import { AddBeneficiaryWalletDto } from './beneficiary-wallet/dto/add-beneficiary-wallet.dto';
import { BeneficiaryUserService } from './beneficiary-user/beneficiary-user.service';
import { BeneficiaryWalletService } from './beneficiary-wallet/beneficiary-wallet.service';
import { BeneficiaryService } from './beneficiary.service';
import { TypesOfBeneficiary } from './beneficiary.types';
import { VerifyWalletAddressDto } from './beneficiary-wallet/dto/verify-wallet-address.dto';
import { VerifyWalletExistResponseDto } from './beneficiary-wallet/dto/verify-wallet-address-response.dto';

@Controller('beneficiary')
@ApiTags('Manage beneficiaries')
export class BeneficiaryController {
  constructor(
    private readonly beneficiaryService: BeneficiaryService,
    private readonly beneficiaryUserService: BeneficiaryUserService,
    private readonly beneficiaryWalletService: BeneficiaryWalletService,
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
    const types = Object.values(TypesOfBeneficiary);

    return types;
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
    return this.beneficiaryUserService.create({
      payerId: req.user.id,
      payeeId: body.beneficiaryUserId,
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('add-wallet')
  async addBeneficiaryWallet(@Req() req, @Body() body: AddBeneficiaryWalletDto) {
    return this.beneficiaryWalletService.addBeneficiaryWallet(body, req.user.id);
  }
}
