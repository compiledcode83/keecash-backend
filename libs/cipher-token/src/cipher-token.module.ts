import { Module } from '@nestjs/common';
import { CipherTokenRepository } from './cipher-token.repository';
import { CipherTokenService } from './cipher-token.service';

@Module({
  providers: [CipherTokenService, CipherTokenRepository],
  exports: [CipherTokenService],
})
export class CipherTokenModule {}
