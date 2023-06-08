export interface WebhookDepositResponseInterface {
  event: string;
  merchant_key: string;
  api_id: string;
  payment_reference: string;
  crypto_address: string;
  crypto_currency: string;
  crypto_amount: number;
  order_currency: string;
  order_amount: number;
  exchange_rate: number;
  webhook_data: {
    payer_id: string;
    desired_amount: number;
  };
  receive_amount: number;
  /*
        case 'good': all ok
        case short: return `payment_tier = short : Transaction en attente de confirmation (voir logs ici https://bit.ly/3EZBrw6)`
        case hold: return `payment_tier = hold : The payment is equal to or greater than the requested amount; but the payment cannot be instantly confirmed.	`
        case none: return `payment_tier = none No payment has been detected (yet).`
        case invalid: return `payment_tier = invalid : The payment was rejected by the cryptocurrency network or has a serious issue. (voir logs ici https://bit.ly/3EZBrw6)`
    */
  payment_tier: 'invalid' | 'none' | 'hold' | 'short' | 'good';
  payment_tier_date: string;
  payment_currency: string;
  payment_amount: number;
  payment_crypto_amount: number;
  transaction_fee_amount: string;
  vat_amount: string;
  status: string;
  status_date: string;
}
