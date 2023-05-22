import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CardService } from './card.service';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { GetTransferFeeDto } from './dto/get-transfer-fee.dto';
import { TransferApplyDto } from './dto/transfer-apply.dto';

@Controller('transfer')
@ApiTags('Transfer')
export class TransferController {
  constructor(private readonly cardService: CardService) {}

  @ApiOperation({ description: 'Tranfer settings to initialize frontend' })
  @ApiOkResponse({
    description: 'Transfer settings response',
    schema: {
      example: {},
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('settings')
  async getTransferSettings(@Req() req): Promise<any> {
    return this.cardService.getTransferSettings(req.user.countryId, req.user.id);
  }

  @ApiOperation({ description: 'Get transfer fees' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('fees')
  async transferFees(@Req() req, @Body() body: GetTransferFeeDto) {
    return this.cardService.getTransferFee(req.user.countryId, body);
  }

  @ApiOperation({ description: 'Apply transfer' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('apply')
  async applyTransfer(@Req() req, @Body() body: TransferApplyDto): Promise<void> {
    await this.cardService.applyTransfer(req.user.id, req.user.countryId, body);
  }
}
