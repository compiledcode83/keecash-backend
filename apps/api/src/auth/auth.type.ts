import { UserStatus } from '@app/user';

export interface UserAccessTokenInterface {
  uuid: string;
  email: string;
  referralId: string;
  status: UserStatus;
  type: string;
  pincodeSet: boolean;
  countryId?: number;
}
