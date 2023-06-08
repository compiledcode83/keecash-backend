import { Module } from '@nestjs/common';
import { TripleAService } from './triple-a.service';
import { CipherTokenModule } from '@app/cipher-token';

@Module({
  imports: [CipherTokenModule],
  providers: [TripleAService],
  exports: [TripleAService],
})
export class TripleAModule {}
