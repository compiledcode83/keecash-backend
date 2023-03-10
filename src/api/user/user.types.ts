export enum Language {
  English = 'ENGLISH',
  French = 'FRENCH',
}

export enum AccountType {
  Person = 'PERSON',
  Enterprise = 'ENTERPRISE',
}

export enum UserStatus {
  Registered = 'REGISTERED',
  EmailValidated = 'EMAIL_VALIDATED',
  PhoneValidated = 'PHONE_VALIDATED',
  KycValidated = 'KYC_VALIDATED',
  KycPending = 'KYC_PENDING',
  KybValidated = 'KYB_VALIDATED',
  Completed = 'COMPLETED',
  Rejected = 'REJECTED',
  Disabled = 'DISABLED',
  Deleted = 'DELETED',
  PinCodeSet = 'PIN_CODE_SET',
}
