export interface TripleAPaymentDetails {
  type: 'triplea' | 'widget';
  payment_reference: string;
  crypto_currency: string;
  crypto_address: string;
  crypto_amount: number;
  order_currency: string;
  order_amount: number;
  exchange_rate: number;
  status: string;
  status_date: string;
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
  cart: {
    items: {
      sku: string;
      label: string;
      quantity: number;
      amount: number;
    }[];
    shipping_cost: number;
    shipping_discount: number;
    tax_cost: number;
  };
  crypto_uri: string;
  expires_in: number;
  site_name: string;
  success_url: string;
  cancel_url: string;
  hosted_page: {
    version: number;
    name: string;
    logo_url: string;
    tagline: string;
    btn_primary_background_color: string;
    btn_primary_color: string;
    page_background_color: string;
  };
  remain_crypto_amount: number;
  payer_id: string;
  payer_name: string;
  payer_email: string;
  payer_phone: string;
  payer_address: string;
  payer_poi: string;
  payer_ip: string;
  required_payer_data: {
    email_or_phone: boolean;
    name: boolean;
    poi: boolean;
    block: boolean;
  };
  txs: [
    {
      t3a_id: string;
      txid: string;
      vout_n: number;
      order_currency: string;
      receive_amount: number;
      status: 'invalid' | 'none' | 'hold' | 'short' | 'good';
      status_date: string;
      payment_tier: string;
      payment_tier_date: string;
      payment_currency: string;
      payment_amount: number;
      payment_crypto_amount: number;
    },
  ];
}
