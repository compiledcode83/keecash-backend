import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
  BadRequestException,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { TripleAService } from './triple-a.service';
import { CryptoConfirmCancelWithdrawDto } from './dto/crypto-confirm-withdraw.dto';
import { CryptoDepositDto } from './dto/crypto-deposit.dto';
import { CryptoPaymentNotifyDto } from './dto/crypto-payment-notify.dto';
import { CryptoPayoutNotifyDto } from './dto/crypto-payout-notify.dto';
import { CryptoTransferDto } from './dto/crypto-transfer.dto';
import { CryptoWithdrawDto } from './dto/crypto-withdraw.dto';

@Controller('triple-a')
export class TripleAController {
  constructor(private readonly cryptoTxService: TripleAService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('deposit')
  async cryptoDeposit(@Request() req, @Body() body: CryptoDepositDto) {
    const res = await this.cryptoTxService.cryptoDeposit(body, req.user.email);
    if (res === false) {
      const res = await this.cryptoTxService.cryptoDeposit(body, req.user.email);
      if (res === false) throw new BadRequestException('You can not deposit');

      return res;
    }

    return res;
  }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Post('withdraw')
  // async cryptoWidthdraw(@Request() req, @Body() body: CryptoWithdrawDto) {
  //   const currencyBalance = await this.cryptoTxService.getBalanceByCurrency(
  //     req.user.id,
  //     body.currency_name,
  //   );
  //   if (currencyBalance < body.amount) throw new BadRequestException('Invalid currency amount');
  //   const res = await this.cryptoTxService.cryptoWithdraw(body, req.user.email, req.user.id);
  //   if (res === false) {
  //     const res = await this.cryptoTxService.cryptoWithdraw(body, req.user.email, req.user.id);
  //     if (res === false) throw new BadRequestException('You can not withdraw');

  //     return res;
  //   }

  //   return res;
  // }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('confirm-withdraw')
  async cryptoConfirmWidthdraw(@Body() body: CryptoConfirmCancelWithdrawDto) {
    const res = await this.cryptoTxService.cryptoConfirmWithraw(body);

    return res;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('cancel-withdraw')
  async cryptoCancelWidthdraw(@Body() body: CryptoConfirmCancelWithdrawDto) {
    const res = await this.cryptoTxService.cryptoCancelWithraw(body);

    return res;
  }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Post('transfer')
  // async cryptoTransfer(@Request() req, @Body() body: CryptoTransferDto) {
  //   const res = await this.cryptoTxService.cryptoTransfer(body, req.user.id);

  //   return res;
  // }

  // @Post('payment-notifiy-deposit')
  // async paymentNotifyDeposit(@Body() body: CryptoPaymentNotifyDto) {
  //   await this.cryptoTxService.paymentNotifyDeposit(body);

  //   return true;
  // }

  // @Post('payment-notifiy-withdraw')
  // async paymentNotifyWithdraw(@Body() body: CryptoPayoutNotifyDto) {
  //   await this.cryptoTxService.paymentNotifyWithdraw(body);

  //   return true;
  // }
}
