import { AdminTypeEnum } from '@src/admin/admin.types';
import { Status } from '@src/user/user.types';

export interface AccessTokenInterfaceForUser {
  id: number;
  firstName: string;
  secondName: string;
  email: string;
  status: Status;
  type: string;
}

export interface AccessTokenInterfaceForAdmin {
  id: number;
  email: string;
  type: AdminTypeEnum;
}
