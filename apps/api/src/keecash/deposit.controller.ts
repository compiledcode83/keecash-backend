import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequestToBodyInterceptor, RequestToQueryInterceptor } from '@app/common';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { KeecashService } from './keecash.service';
import { GetDepositFeeDto } from './dto/get-deposit-fee.dto';
import { DepositPaymentLinkDto } from './dto/deposit-payment-link.dto';

@ApiTags('Deposit')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('deposit')
export class DepositController {
  constructor(private readonly keecashService: KeecashService) {}

  @ApiOperation({ description: 'Post deposit fees' })
  @UseInterceptors(ClassSerializerInterceptor, new RequestToQueryInterceptor('user', 'user'))
  @Get('fees')
  async depositFees(@Query() query: GetDepositFeeDto) {
    return this.keecashService.getDepositFee(query);
  }

  @ApiOperation({ description: 'Post deposit payment link' })
  @UseInterceptors(ClassSerializerInterceptor, new RequestToBodyInterceptor('user', 'user'))
  @Post('payment-link')
  async getDepositPaymentLink(@Body() body: DepositPaymentLinkDto): Promise<{ link: string }> {
    return this.keecashService.getDepositPaymentLink(body);
  }
}
