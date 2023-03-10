import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CountryService } from '@api/country/country.service';

@ValidatorConstraint({ name: 'userExistsByEmailValidator', async: true })
export class CountryExistsByNameValidator implements ValidatorConstraintInterface {
  constructor(private readonly countryService: CountryService) {}

  async validate(country: string, args: ValidationArguments): Promise<boolean> {
    const countryExists = await this.countryService.findCountryByName(country);

    return Boolean(countryExists);
  }

  defaultMessage(args: ValidationArguments) {
    return `Can not find '${args.value}' country`;
  }
}
