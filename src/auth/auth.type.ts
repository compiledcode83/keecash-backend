import { Status } from '@src/user/table/user.entity';

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
  type: string;
}
