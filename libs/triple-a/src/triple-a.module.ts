import { Module, OnModuleInit } from '@nestjs/common';
import { TripleAService } from './triple-a.service';
import { FiatCurrencyEnum } from '@app/common';
import { CipherTokenModule } from '@app/cipher-token';

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
