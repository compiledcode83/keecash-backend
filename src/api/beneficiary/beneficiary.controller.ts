import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Req,
  Param,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { AddBeneficiaryUserDto } from './beneficiary-user/dto/add-beneficiary-user.dto';
import { AddBeneficiaryWalletDto } from './beneficiary-wallet/dto/add-beneficiary-wallet.dto';
import { BeneficiaryUserService } from './beneficiary-user/beneficiary-user.service';
import { BeneficiaryWalletService } from './beneficiary-wallet/beneficiary-wallet.service';
import { BeneficiaryService } from './beneficiary.service';
import { VerifyWalletAddressDto } from './beneficiary-wallet/dto/verify-wallet-address.dto';
import { VerifyWalletExistResponseDto } from './beneficiary-wallet/dto/verify-wallet-address-response.dto';
import { GetBeneficiaryWalletsDto } from './dto/get-beneficiary-wallets.dto';
import { BeneficiaryAllResponseDto } from './dto/beneficiary-all-response.dto';
import { BeneficiaryWalletsDto } from './beneficiary-wallet/dto/beneficiary-wallets.dto';
@Controller('beneficiary')
@ApiTags('Manage beneficiaries')
export class BeneficiaryController {
  constructor(
    private readonly beneficiaryService: BeneficiaryService,
    private readonly beneficiaryUserService: BeneficiaryUserService,
    private readonly beneficiaryWalletService: BeneficiaryWalletService,
  ) {}

  @ApiOperation({ description: `Get all beneficiary users and wallets` })
  @ApiOkResponse({
    description: 'Get all beneficiaries response',
    type: BeneficiaryAllResponseDto,
    isArray: false,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('all')
  async getAllBeneficiaries(@Req() req) {
    return this.beneficiaryService.findAllByUserId(req.user.id);
  }

  @ApiOperation({
    description: `Get all types of beneficiary wallet`,
    responses: {},
  })
  @ApiOkResponse({
    description: `All types for wallet beneficiary : \`['USER','BTC','BTC_LIGHTNING','USDT_TRC20','ETH','USDT_ERC20','USDC','BINANCE']\``,
    isArray: true,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('types')
  async getBeneficiaryTypes() {
    const types = this.beneficiaryService.getBeneficiaryTypes();

    return types;
  }

  @ApiOperation({ description: `Verify if crypto address exists` })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Verify crypto address response',
    type: VerifyWalletExistResponseDto,
    isArray: false,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('verify-crypto-address')
  async verifyCryptoAddress(
    @Req() req: any,
    @Body() body: VerifyWalletAddressDto,
  ): Promise<VerifyWalletExistResponseDto> {
    const res = await this.beneficiaryWalletService.validateCryptoAddress(
      body.blockchain,
      body.cryptoAddress,
      req.user.id,
    );

    return { valid: res.isCryptoWalletAlreadySave && res.isCryptoWalletOK };
  }

  @ApiOperation({ description: 'Add a user beneficiaries for transfer' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('add-user')
  async addBeneficiaryUser(@Req() req, @Body() body: AddBeneficiaryUserDto) {
    try {
      //check all condition before add a user
      await this.beneficiaryUserService.checkConditionsToAddBeneficiary(
        body.beneficiaryUserId,
        req.user.id,
      );

      this.beneficiaryUserService.create({
        payerId: req.user.id,
        payeeId: body.beneficiaryUserId,
      });

      return;
    } catch (e) {
      throw e;
    }
  }

  @ApiOperation({ description: 'Add crypto wallet as beneficiary' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('add-wallet')
  async addBeneficiaryWallet(@Req() req, @Body() body: AddBeneficiaryWalletDto) {
    const res = await this.beneficiaryWalletService.validateCryptoAddress(
      body.type,
      body.address,
      req.user.id,
    );

    if (!res.isCryptoWalletOK) {
      throw new UnauthorizedException(`Address not valid for ${body.type}`);
    }

    if (res.isCryptoWalletAlreadySave) {
      throw new UnauthorizedException(`User has already saved this wallet`);
    }

    this.beneficiaryService.createBeneficiaryWallet({
      userId: req.user.id,
      address: body.address,
      type: body.type,
      name: body.name,
    });

    return;
  }

  @ApiOperation({ description: 'Get withdrawal beneficiaries wallets' })
  @ApiOkResponse({
    description: 'Wallet list response',
    type: BeneficiaryWalletsDto,
  })
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
