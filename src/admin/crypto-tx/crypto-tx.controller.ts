import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { GetCryptoTxAdminDto } from '../admin/dto/get-crypto-tx-admin.dto';

@Controller()
@ApiTags('Transactions Logs')
export class AdminCryptoTxController {
  constructor() {}

  // @ApiOperation({ description: `Get Crypto Transactions` })
  // @ApiBearerAuth()
  // @UseGuards(JwtAdminAuthGuard)
  // @Get()
  // async getCryptoTx(@Query() query: GetCryptoTxAdminDto) {
  //   return this.cryptoTxService.findAllPaginated(query);
  // }
}
