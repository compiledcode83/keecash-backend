export interface AccessTokenInterfaceForUser {
  id: number;
  firstName: string;
  secondName: string;
  email: string;
  phoneNumber: string;
  type: string;
}

export interface AccessTokenInterfaceForAdmin {
  id: number;
  email: string;
  type: string;
}
