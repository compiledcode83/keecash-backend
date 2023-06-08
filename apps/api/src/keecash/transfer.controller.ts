import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
<<<<<<< HEAD:apps/api/src/keecash/transfer.controller.ts
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
=======
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CardService } from './card.service';
>>>>>>> 381621e06e83efe140d01ba95f21884ffdfb849c:src/api/card/transfer.controller.ts
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { KeecashService } from './keecash.service';
import { GetTransferFeeDto } from './dto/get-transfer-fee.dto';
import { TransferApplyDto } from './dto/transfer-apply.dto';

@ApiTags('Transfer')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transfer')
@ApiTags('Transfer')
export class TransferController {
  constructor(private readonly keecashService: KeecashService) {}

<<<<<<< HEAD:apps/api/src/keecash/transfer.controller.ts
  @ApiOperation({ description: 'Get transfer fees' })
  @Get('fees')
  async transferFees(@Req() req, @Query() query: GetTransferFeeDto) {
    return this.keecashService.getTransferFee(req.user.countryId, query);
  }

  @ApiOperation({ description: 'Apply transfer' })
=======
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
>>>>>>> 381621e06e83efe140d01ba95f21884ffdfb849c:src/api/card/transfer.controller.ts
  @Post('apply')
  async applyTransfer(@Req() req, @Body() body: TransferApplyDto): Promise<void> {
    await this.keecashService.applyTransfer(req.user.id, req.user.countryId, body);
  }
}
