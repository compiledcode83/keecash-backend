import { UserStatus } from '@api/user/user.types';

export interface UserAccessTokenInterface {
  id: number;
  firstName: string;
  secondName: string;
  email: string;
  referralId: string;
  status: UserStatus;
  type: string;
}
