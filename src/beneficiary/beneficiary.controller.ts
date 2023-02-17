import { Body, Request, Controller, Post, UseGuards, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/auth/guards/jwt-auth.guard';
import { BeneficiaryService } from './beneficiary.service';
import { AddBeneficiaryUserDto } from './dto/add-beneficiary-user.dto';
import { AddBeneficiaryWalletDto } from './dto/add-beneficiary-wallet.dto';
import { CryptoCurrencyEnum } from '@src/crypto-tx/crypto-tx.types';

@Controller('beneficiary')
export class BeneficiaryController {
  constructor(private readonly beneficiaryService: BeneficiaryService) {}

  @ApiOperation({ description: `Get all beneficiary users and wallets` })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('all')
  async getAllBeneficiaries(@Request() req) {
    const beneficiaryUsers = await this.beneficiaryService.getBeneficiaryUsers(req.user.id);
    const beneficiaryWallets = await this.beneficiaryService.getBeneficiaryWallets(req.user.id);

    return {
      users: beneficiaryUsers,
      wallets: beneficiaryWallets,
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
  async verifyUserExist() {
    return;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('add-user')
  async addBeneficiaryUser(@Body() body: AddBeneficiaryUserDto, @Request() req) {
    return this.beneficiaryService.addBeneficiaryUser(body, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('add-wallet')
  async addBeneficiaryWallet(@Body() body: AddBeneficiaryWalletDto, @Request() req) {
    return this.beneficiaryService.addBeneficiaryWallet(body, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getBeneficiaryUsers(@Request() req) {
    return this.beneficiaryService.getBeneficiaryUsers(req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('wallets')
  async getBeneficiaryUser(@Request() req) {
    return this.beneficiaryService.getBeneficiaryWallets(req.user.id);
  }
}
