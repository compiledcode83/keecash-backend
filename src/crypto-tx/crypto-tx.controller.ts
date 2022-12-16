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
import { JwtAuthGuard } from '@src/auth/guards/jwt-auth.guard';
import { FIAT_CURRENCY_NAME } from './crypto-tx.entity';
import { CryptoTxService } from './crypto-tx.service';
import { CryptoConfirmCancelWithdrawDto } from './dto/crypto-confirm-withdraw.dto';
import { CryptoDepositDto } from './dto/crypto-deposit.dto';
import { CryptoPaymentNotifyDto } from './dto/crypto-payment-notify.dto';
import { CryptoTransactionFilterDto } from './dto/crypto-transaction-filter.dto';
import { CryptoTransferDto } from './dto/crypto-transfer.dto';
import { CryptoWithdrawDto } from './dto/crypto-withdraw.dto';

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
    @Param('currency') currency: string,
    @Request() req,
  ) {
    const currencyName = currency.toUpperCase();
    if (
      !Object.values(FIAT_CURRENCY_NAME).includes(
        currencyName as FIAT_CURRENCY_NAME,
      )
    )
      throw new BadRequestException('Can not find currency name');
    return this.cryptoTxService.getBalanceByCurrency(
      req.user.id,
      currency.toUpperCase(),
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('transactions')
  async getTransactions(
    @Query() searchParams: CryptoTransactionFilterDto,
    @Request() req,
  ) {
    return this.cryptoTxService.findAllPaginated(searchParams, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('last-transaction')
  async getLastTransaction(@Request() req) {
    return this.cryptoTxService.getLastTransaction(req.user.id);
  }

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
  @UseGuards(JwtAuthGuard)
  @Post('withdraw')
  async crytpoWidthdraw(@Request() req, @Body() body: CryptoWithdrawDto) {
    const res = await this.cryptoTxService.cryptoDeposit(body, req.user.email);
    if (res === false) {
      const res = await this.cryptoTxService.cryptoWithdraw(
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
  @Put('confirm-withdraw')
  async crytpoConfirmWidthdraw(@Body() body: CryptoConfirmCancelWithdrawDto) {
    const res = await this.cryptoTxService.cryptoConfirmCancelWithraw(body);
    return res;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('transfer')
  async crytpoTransfer(@Request() req, @Body() body: CryptoTransferDto) {
    const res = await this.cryptoTxService.cryptoTransfer(body, req.user.id);
    return res;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('cancel-withdraw')
  async crytpoCancelWidthdraw(@Body() body: CryptoConfirmCancelWithdrawDto) {
    const res = await this.cryptoTxService.cryptoConfirmCancelWithraw(body);
    return res;
  }

  @ApiBearerAuth()
  @Post('payment-notifiy')
  async paymentNotify(@Body() body: CryptoPaymentNotifyDto) {
    await this.cryptoTxService.paymentNotify(body);
    return true;
  }
}
