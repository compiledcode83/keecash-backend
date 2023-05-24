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

  static async getImageTransaction(descriptionRaw: string) {
    const description = descriptionRaw.toLocaleLowerCase().trim();

    switch (true) {
      case description.includes('meta') ||
        description.includes('facebook') ||
        description.includes('facebk'):
        return `https://storage.googleapis.com/free-access-bucket-keecash-v2/meta.svg`;
      case description.includes('instagram'):
        return `https://storage.googleapis.com/free-access-bucket-keecash-v2/instagram.svg`;
      case description.includes('playstation'):
        return `https://storage.googleapis.com/free-access-bucket-keecash-v2/playstation.svg`;
      case description.includes('google'):
        return `https://storage.googleapis.com/free-access-bucket-keecash-v2/google.svg`;
      case description.includes('paypal'):
        return `https://storage.googleapis.com/free-access-bucket-keecash-v2/paypal.svg`;
      case description.includes('xbox'):
        return `https://storage.googleapis.com/free-access-bucket-keecash-v2/xbox.svg`;
      case description.includes('netflix'):
        return `https://storage.googleapis.com/free-access-bucket-keecash-v2/netflix.svg`;
      case description.includes('microsoft'):
        return `https://storage.googleapis.com/free-access-bucket-keecash-v2/microsoft.svg`;
      case description.includes('apple'):
        return `https://storage.googleapis.com/free-access-bucket-keecash-v2/apple.svg`;
      case description.includes('amazon'):
        return `https://storage.googleapis.com/free-access-bucket-keecash-v2/amazon.svg`;
      case description.includes('aliexpress') || description.includes('alibaba'):
        return `https://storage.googleapis.com/free-access-bucket-keecash-v2/alibaba.svg`;
      case description.includes('binance'):
        return `https://storage.googleapis.com/free-access-bucket-keecash-v2/Binance.svg`;
      case description.includes('coinbase'):
        return `https://storage.googleapis.com/free-access-bucket-keecash-v2/coinbase.svg`;
      default:
        return `https://storage.googleapis.com/free-access-bucket-keecash-v2/basket.svg`;
    }
  }
}
