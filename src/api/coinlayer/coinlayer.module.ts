import { CipherTokenModule } from '@api/cipher-token/cipher-token.module';
import { Module } from '@nestjs/common';
import { CoinlayerService } from './coinlayer.service';

@Module({
  imports: [CipherTokenModule],
  providers: [CoinlayerService],
  exports: [CoinlayerService],
})
export class CoinlayerModule {}
