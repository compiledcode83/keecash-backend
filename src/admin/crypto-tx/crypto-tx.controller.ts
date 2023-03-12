import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CryptoTxService } from '@api/crypto-tx/crypto-tx.service';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { GetCryptoTxAdminDto } from '../admin/dto/get-crypto-tx-admin.dto';

@Controller()
@ApiTags('Transactions Logs')
export class AdminCryptoTxController {
  constructor(private readonly cryptoTxService: CryptoTxService) {}

  @ApiOperation({ description: `Get Crypto Transactions` })
  @UseGuards(JwtAdminAuthGuard)
  @Get()
  async getCryptoTx(@Query() query: GetCryptoTxAdminDto) {
    return this.cryptoTxService.findAllPaginated(query);
  }
}
