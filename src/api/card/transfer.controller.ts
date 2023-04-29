import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CardService } from './card.service';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { GetTransferFeeDto } from './dto/get-transfer-fee.dto';
import { TransferApplyDto } from './dto/transfer-apply.dto';

@Controller('transfer')
export class TransferController {
  constructor(private readonly cardService: CardService) {}

  // @ApiOperation({ description: 'Get transfer settings' })
  // @ApiTags('Transfer')
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Get('settings')
  // async transferSettings(@Req() req) {
  //   return this.cardService.getTransferSettings(req.user.id);
  // }

  @ApiOperation({ description: 'Get transfer fees' })
  @ApiTags('Transfer')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('fees')
  async transferFees(@Req() req, @Query() query: GetTransferFeeDto) {
    return this.cardService.getTransferFee(req.user.countryId, query);
  }

  @ApiOperation({ description: 'Apply transfer' })
  @ApiTags('Transfer')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('apply')
  async applyTransfer(@Req() req, @Body() body: TransferApplyDto): Promise<void> {
    await this.cardService.applyTransfer(req.user.id, body);
  }
}
