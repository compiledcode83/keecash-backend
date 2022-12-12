import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/auth/guards/jwt-auth.guard';
import { CryptoTxService } from './crypto-tx.service';
import { CryptoDepositDto } from './dto/crypto-deposit.dto';
import { CryptoPaymentNotifyDto } from './dto/crypto-payment-notify.dto';

@Controller('crypto-tx')
export class CryptoTxController {
  constructor(private readonly cryptoTxService: CryptoTxService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('deposit')
  async crytpoDeposit(@Request() req, @Body() body: CryptoDepositDto) {
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
