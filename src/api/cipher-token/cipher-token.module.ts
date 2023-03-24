import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CipherToken } from './cipher-token.entity';
import { CipherTokenRepository } from './cipher-token.repository';
import { CipherTokenService } from './cipher-token.service';

@Module({
  imports: [TypeOrmModule.forFeature([CipherToken])],
  providers: [CipherTokenService, CipherTokenRepository],
  exports: [CipherTokenService],
})
export class CipherTokenModule {}
