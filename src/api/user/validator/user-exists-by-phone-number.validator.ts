import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserService } from '../user.service';

@ValidatorConstraint({ name: 'userExistsByEmailValidator', async: true })
export class UserExistsByPhoneNumberValidator implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}

  async validate(phoneNumber: string, args: ValidationArguments): Promise<boolean> {
    const userExists = await this.userService.findByPhonenumber(phoneNumber);

    return !Boolean(userExists);
  }

  defaultMessage(args: ValidationArguments) {
    return `User with phone number '${args.value}' already exists`;
  }
}
