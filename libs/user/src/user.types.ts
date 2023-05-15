export enum Language {
  English = 'en',
  French = 'fr',
}

export enum AccountType {
  Person = 'PERSON',
  Enterprise = 'ENTERPRISE',
}

export enum UserStatus {
  Registered = 'REGISTERED',
  Completed = 'COMPLETED',
  Disabled = 'DISABLED',
  Closed = 'CLOSED',
}

export enum VerificationStatus {
  NotStarted = 'NOT_STARTED',
  Pending = 'PENDING',
  Validated = 'VALIDATED',
  Rejected = 'REJECTED',
}

export enum UserEventPattern {
  UserCreate = 'user.create',
  UserComplete = 'user.complete',
}
