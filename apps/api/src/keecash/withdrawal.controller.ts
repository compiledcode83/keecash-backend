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
import { GetWithdrawalFeeDto } from './dto/get-withdrawal-fee.dto';
import { WithdrawalApplyDto } from './dto/withdrawal-apply.dto';

@ApiTags('Withdrawal')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('withdrawal')
export class WithdrawalController {
  constructor(private readonly keecashService: KeecashService) {}

  @ApiOperation({ description: 'Post withdrawal fees' })
  @UseInterceptors(ClassSerializerInterceptor, new RequestToQueryInterceptor('user', 'user'))
  @Get('fees')
  async withdrawalFees(@Query() query: GetWithdrawalFeeDto) {
    return this.keecashService.getWithdrawalFee(query);
  }

  @ApiOperation({ description: 'Apply withdrawal' })
  @UseInterceptors(ClassSerializerInterceptor, new RequestToBodyInterceptor('user', 'user'))
  @Post('apply')
  async applyWithdrawal(@Body() body: WithdrawalApplyDto): Promise<any> {
    return this.keecashService.applyWithdrawal(body);
  }
}
