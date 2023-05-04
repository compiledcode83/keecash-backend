import { Module, OnModuleInit } from '@nestjs/common';
import { TripleAService } from './triple-a.service';
import { FiatCurrencyEnum } from '@api/transaction/transaction.types';
import { CipherTokenModule } from '@api/cipher-token/cipher-token.module';

@Module({
  imports: [CipherTokenModule],
  providers: [TripleAService],
  exports: [TripleAService],
})
export class TripleAModule implements OnModuleInit {
  constructor(private readonly tripleAService: TripleAService) {}

  async onModuleInit() {
    // await Promise.all(
    //   Object.keys(FiatCurrencyEnum).map((currency) =>
    //     this.tripleAService.getAccessToken(currency as FiatCurrencyEnum),
    //   ),
    // );
  }
}
