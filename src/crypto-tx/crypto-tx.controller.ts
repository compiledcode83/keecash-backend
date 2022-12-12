import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/auth/guards/jwt-auth.guard';
import { CryptoTxService } from './crypto-tx.service';
import { CryptoDepositWithdrawDto } from './dto/crypto-deposit.dto';
import { CryptoPaymentNotifyDto } from './dto/crypto-payment-notify.dto';

@Controller('crypto-tx')
export class CryptoTxController {
  constructor(private readonly cryptoTxService: CryptoTxService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('balance')
  async getBalances(@Request() req) {
    return this.cryptoTxService.getBalances(req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('balance/:currency')
  async getBalanceByCurrency(
    @Param('currency') currencyName: string,
    @Request() req,
  ) {
    return this.cryptoTxService.getBalanceByCurrency(
      req.user.id,
      currencyName.toUpperCase(),
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('deposit')
  async crytpoDeposit(@Request() req, @Body() body: CryptoDepositWithdrawDto) {
    const res = await this.cryptoTxService.cryptoDeposit(body, req.user.email);
    if (res === false) {
      const res = await this.cryptoTxService.cryptoDeposit(
        body,
        req.user.email,
      );
      if (res === false) throw new BadRequestException('You can not deposit');
      return res;
    }
    return res;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('withdraw')
  async crytpoWidthdraw(
    @Request() req,
    @Body() body: CryptoDepositWithdrawDto,
  ) {
    const res = await this.cryptoTxService.cryptoDeposit(body, req.user.email);
    if (res === false) {
      const res = await this.cryptoTxService.cryptoDeposit(
        body,
        req.user.email,
      );
      if (res === false) throw new BadRequestException('You can not deposit');
      return res;
    }
    return res;
  }

  @ApiBearerAuth()
  @Post('payment-notifiy')
  async paymentNotify(@Body() body: CryptoPaymentNotifyDto) {
    this.cryptoTxService.paymentNotify(body);
    return true;
  }
}
