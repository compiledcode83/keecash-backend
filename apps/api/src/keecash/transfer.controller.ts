import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { KeecashService } from './keecash.service';
import { GetTransferFeeDto } from './dto/get-transfer-fee.dto';
import { TransferApplyDto } from './dto/transfer-apply.dto';

@Controller('transfer')
export class TransferController {
  constructor(private readonly keecashService: KeecashService) {}

  @ApiOperation({ description: 'Get transfer fees' })
  @ApiTags('Transfer')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('fees')
  async transferFees(@Req() req, @Query() query: GetTransferFeeDto) {
    return this.keecashService.getTransferFee(req.user.countryId, query);
  }

  @ApiOperation({ description: 'Apply transfer' })
  @ApiTags('Transfer')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('apply')
  async applyTransfer(@Req() req, @Body() body: TransferApplyDto): Promise<void> {
    await this.keecashService.applyTransfer(req.user.id, req.user.countryId, body);
  }
}
