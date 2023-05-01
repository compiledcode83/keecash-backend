import { Body, Controller, Post, UseGuards, Get, Req, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { AddBeneficiaryUserDto } from './beneficiary-user/dto/add-beneficiary-user.dto';
import { AddBeneficiaryWalletDto } from './beneficiary-wallet/dto/add-beneficiary-wallet.dto';
import { BeneficiaryUserService } from './beneficiary-user/beneficiary-user.service';
import { BeneficiaryWalletService } from './beneficiary-wallet/beneficiary-wallet.service';
import { BeneficiaryService } from './beneficiary.service';
import { TypesOfBeneficiary } from './beneficiary.types';
import { VerifyWalletAddressDto } from './beneficiary-wallet/dto/verify-wallet-address.dto';
import { VerifyWalletExistResponseDto } from './beneficiary-wallet/dto/verify-wallet-address-response.dto';
import { CryptoCurrencyEnum } from '@api/transaction/transaction.types';
import { GetBeneficiaryWalletsDto } from './dto/get-beneficiary-wallets.dto';

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
    // const types = Object.values(TypesOfBeneficiary);
    const types = ['USER', 'BTC', 'USDT_TRC20', 'ETH', 'USDT_ERC20', 'USDC', 'BINANCE'];

    return types;
  }

  // @ApiOperation({ description: `Verify if crypto address exists` })
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Post('verify-crypto-address')
  // async verifyCryptoAddress(
  //   @Body() body: VerifyWalletAddressDto,
  // ): Promise<VerifyWalletExistResponseDto> {
  //   const doesExist = await this.beneficiaryWalletService.checkIfExist({
  //     address: body.cryptoAddress,
  //   });

  //   return { valid: doesExist };
  // }

  @ApiOperation({ description: 'Get withdrawal beneficiaries' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('add-user')
  async addBeneficiaryUser(@Req() req, @Body() body: AddBeneficiaryUserDto) {
    return this.beneficiaryUserService.create({
      payerId: req.user.id,
      payeeId: body.beneficiaryUserId,
    });
  }

  @ApiOperation({ description: 'Get withdrawal beneficiaries' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('add-wallet')
  async addBeneficiaryWallet(@Req() req, @Body() body: AddBeneficiaryWalletDto) {
    return this.beneficiaryService.createBeneficiaryWallet({
      userId: req.user.id,
      address: body.address,
      type: body.type,
    });
  }

  @ApiOperation({ description: 'Get withdrawal beneficiaries' })
  @ApiParam({ name: 'currency', required: true, description: 'Keecash wallet currency' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('wallets/:currency')
  async getBeneficiaryWallets(@Req() req, @Param() param: GetBeneficiaryWalletsDto) {
    const beneficiary_wallets = await this.beneficiaryService.findBeneficiaryWallets({
      userId: req.user.id,
      type: param.currency,
    });

    return { beneficiary_wallets };
  }
}
