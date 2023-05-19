import { CryptoCurrencyEnum } from '@api/transaction/transaction.types';

export class ToolsHelper {
  //enable to get raw blockchain to use in validation crypto tools
  static getRawBlockchainForValidation = (blockchain: string | CryptoCurrencyEnum): string => {
    switch (blockchain) {
      case CryptoCurrencyEnum.BTC_LIGHTNING:
        return CryptoCurrencyEnum.BTC;
      case CryptoCurrencyEnum.LBTC:
        return CryptoCurrencyEnum.BTC;
      case CryptoCurrencyEnum.USDT_ERC20:
        return CryptoCurrencyEnum.ETH;
      case CryptoCurrencyEnum.USDT_TRC20:
        return 'Tron';
      default:
        return blockchain;
    }
  };

  static getRawBlockchainForGetTripleAId = (blockchain: string | CryptoCurrencyEnum): string => {
    switch (blockchain) {
      case CryptoCurrencyEnum.BTC_LIGHTNING:
        return 'LNBC';
      case CryptoCurrencyEnum.LBTC:
        return 'LNBC';
      case CryptoCurrencyEnum.USDT_ERC20:
        return 'USDTERC20';
      case CryptoCurrencyEnum.USDT_TRC20:
        return 'USDTTRC20';
      case CryptoCurrencyEnum.BINANCE:
        return 'Binance';
      default:
        return blockchain;
    }
  };
}
