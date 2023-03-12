import { Body, Request, Controller, Post, UseGuards, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { AddBeneficiaryUserDto } from './beneficiary-user/dto/add-beneficiary-user.dto';
import { AddBeneficiaryWalletDto } from './beneficiary-wallet/dto/add-beneficiary-wallet.dto';
import { CryptoCurrencyEnum } from '@api/crypto-tx/crypto-tx.types';
import { BeneficiaryUserService } from './beneficiary-user/beneficiary-user.service';
import { BeneficiaryWalletService } from './beneficiary-wallet/beneficiary-wallet.service';
import { BeneficiaryService } from './beneficiary.service';

@Controller()
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
  async getAllBeneficiaries(@Request() req) {
    return this.beneficiaryService.findAllByUserId(req.user.id);

    return {
      users: [
        {
          firstName: 'Hol',
          lastName: 'Mayissa',
          email: 'big.boss@keecash.com',
          referalId: 'LPUMIRY',
        },
        {
          firstName: 'Hol',
          lastName: 'Mayissa',
          email: 'big.boss@keecash.com',
          referalId: 'LPUMIRY',
        },
      ],
      wallets: [
        {
          address: '0x80788e2A335BCC461CA9A0d6b912cdE37C7bbB86',
          name: 'My Ether wallet',
          userId: 1,
          type: CryptoCurrencyEnum.ETH_ERC20,
        },
        {
          address: '0x80788e2A335BCC461CA9A0d6b912cdE37C7bbB86',
          name: 'My BTC wallet',
          userId: 1,
          type: CryptoCurrencyEnum.BTC,
        },
      ],
    };
  }

  @ApiOperation({ description: `Get all types of beneficiary wallet` })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('types')
  async getBeneficiaryTypes() {
    const types = Object.values(CryptoCurrencyEnum);

    return types;
  }

  @ApiOperation({ description: `Verify if user exists` })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('verify-user-exist')
  async verifyUserExist(@Body() body) {
    const { userField } = body;

    return;
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

  //   @ApiBearerAuth()
  //   @UseGuards(JwtAuthGuard)
  //   @Get('users')
  //   async getBeneficiaryUsers(@Request() req) {
  //     return this.beneficiaryUserService.getByPayerId(req.user.id);
  //   }

  //   @ApiBearerAuth()
  //   @UseGuards(JwtAuthGuard)
  //   @Get('wallets')
  //   async getBeneficiaryUser(@Request() req) {
  //     return this.beneficiaryWalletService.getByUserId(req.user.id);
  //   }
}
