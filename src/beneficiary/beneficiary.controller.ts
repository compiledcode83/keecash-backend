import {
  Body,
  Request,
  Controller,
  Post,
  UseGuards,
  Get,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/auth/guards/jwt-auth.guard';
import { BeneficiaryService } from './beneficiary.service';
import { AddBeneficiaryUserDto } from './dto/add-beneficiary-user.dto';
import { AddBeneficiaryWalletDto } from './dto/add-beneficiary-wallet.dto';

@Controller('beneficiary')
export class BeneficiaryController {
  constructor(private readonly beneficiaryService: BeneficiaryService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('add-user')
  async addBeneficiaryUser(
    @Body() body: AddBeneficiaryUserDto,
    @Request() req,
  ) {
    return await this.beneficiaryService.addBeneficiaryUser(body, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('add-wallet')
  async addBeneficiaryWallet(
    @Body() body: AddBeneficiaryWalletDto,
    @Request() req,
  ) {
    return await this.beneficiaryService.addBeneficiaryWallet(
      body,
      req.user.id,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getBeneficiaryUsers(@Request() req) {
    return await this.beneficiaryService.getBeneficiaryUsers(req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('wallets')
  async getBeneficiaryUser(@Request() req) {
    return await this.beneficiaryService.getBeneficiaryWallets(req.user.id);
  }
}
