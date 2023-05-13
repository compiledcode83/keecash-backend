import { CryptoCurrencyEnum } from '@api/transaction/transaction.types';

//enable to get raw blockchain to use in validation crypto tools
export const getRawBlockchainForValidation = (blockchain: string | CryptoCurrencyEnum): string => {
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
