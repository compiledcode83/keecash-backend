export interface BridgecardCardDetailsInterface {
  billing_address: {
    billing_address1: string;
    billing_city: string;
    billing_country: string;
    billing_zip_code: string;
    country_code: string;
  };
  brand: string;
  card_currency: string;
  card_id: string;
  card_name: string;
  card_number: string;
  card_type: string;
  cardholder_id: string;
  created_at: number;
  cvv: string;
  expiry_month: string;
  expiry_year: string;
  is_active: boolean;
  issuing_app_id: string;
  last_4: string;
  livemode: boolean;
  meta_data?: {
    keecash_card_name?: string;
  };
}
