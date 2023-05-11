import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CountryService } from '@app/country';

@ValidatorConstraint({ name: 'countryExistsByEmailValidator', async: true })
export class CountryExistsByNameValidator implements ValidatorConstraintInterface {
  constructor(private readonly countryService: CountryService) {}

  async validate(countryName: string, args: ValidationArguments): Promise<boolean> {
    const countryExists = await this.countryService.findOne({ name: countryName });

    return Boolean(countryExists);
  }

  defaultMessage(args: ValidationArguments) {
    return `Cannot find country: '${args.value}' from database`;
  }
}
