import { AdminTypeEnum } from '../admin/admin.types';

export interface AdminAccessTokenInterface {
  id: number;
  email: string;
  type: AdminTypeEnum;
}
