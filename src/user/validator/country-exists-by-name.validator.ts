import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserService } from '../user.service';

@ValidatorConstraint({ name: 'userExistsByEmailValidator', async: true })
export class CountryExistsByNameValidator implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}

  async validate(country: string, args: ValidationArguments): Promise<boolean> {
    const countryExists = await this.userService.findOneCountryByName(country);

    return Boolean(countryExists);
  }

  defaultMessage(args: ValidationArguments) {
    return `Can not find '${args.value}' country`;
  }
}
