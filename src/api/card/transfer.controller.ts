import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CardService } from './card.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetTransferFeeDto } from './dto/get-transfer-fee.dto';
import { TransferApplyDto } from './dto/transfer-apply.dto';

@Controller('transfer')
export class TransferController {
  constructor(private readonly cardService: CardService) {}

  @ApiOperation({ description: 'Get transfer settings' })
  @ApiTags('Transfer')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('settings')
  async transferSettings(@Req() req) {
    return this.cardService.getTransferSettings(req.user.id, req.user.referralId);
  }

  @ApiOperation({ description: 'Get transfer fees' })
  @ApiTags('Transfer')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('fees')
  async transferFees(@Body() body: GetTransferFeeDto) {
    return this.cardService.getTransferFee(body);
  }

  @ApiOperation({ description: 'Apply transfer' })
  @ApiTags('Transfer')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('apply')
  async applyTransfer(@Body() body: TransferApplyDto): Promise<string> {
    return 'ok';
  }
}
