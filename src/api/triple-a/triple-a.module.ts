import { Module, OnModuleInit } from '@nestjs/common';
// import { CountryFeeModule } from '@api/country-fee/country-fee.module';
// import { UserModule } from '@api/user/user.module';
import { TripleAController } from './tripla-a.controller';
import { TripleAService } from './triple-a.service';
import { FiatCurrencyEnum } from '../transaction/transaction.types';

@Module({
  // imports: [UserModule, CountryFeeModule],
  controllers: [TripleAController],
  providers: [TripleAService],
  exports: [TripleAService],
})
export class TripleAModule implements OnModuleInit {
  constructor(private readonly tripleAService: TripleAService) {}

  async onModuleInit() {
    await Promise.all(
      Object.keys(FiatCurrencyEnum).map((currency) =>
        this.tripleAService.getAccessToken(currency as FiatCurrencyEnum),
      ),
    );
  }
}
