import { UserStatus } from '@api/user/user.types';

export interface UserAccessTokenInterface {
  id: number;
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  referralId: string;
  status: UserStatus;
  type: string;
  pincodeSet: boolean;
  countryId?: number;
}
