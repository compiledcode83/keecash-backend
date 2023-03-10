import { AdminTypeEnum } from '@admin/admin/admin.types';
import { UserStatus } from '@api/user/user.types';

export interface AccessTokenInterfaceForUser {
  id: number;
  firstName: string;
  secondName: string;
  email: string;
  status: UserStatus;
  type: string;
}

export interface AccessTokenInterfaceForAdmin {
  id: number;
  email: string;
  type: AdminTypeEnum;
}
