import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as legit from 'legit';

@ValidatorConstraint({ name: 'legitEmailValidator', async: true })
export class LegitEmailValidator implements ValidatorConstraintInterface {
  constructor() {}

  async validate(email: string, args: ValidationArguments): Promise<boolean> {
    try {
      const isValidEmail = await legit(email);

      return isValidEmail.isValid;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `Invalid email`;
  }
}
