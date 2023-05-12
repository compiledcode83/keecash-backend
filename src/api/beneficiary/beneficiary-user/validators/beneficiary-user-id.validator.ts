import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { AddBeneficiaryUserDto } from '../dto/add-beneficiary-user.dto';

export function BeneficiaryUserIdValidator(
  minLength: number,
  maxLength: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: AddBeneficiaryUserDto, propertyName: string) {
    registerDecorator({
      name: 'BeneficiaryUserIdValidator',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const strValue = String(value);

          return strValue.length >= minLength && strValue.length <= maxLength;
        },
        defaultMessage(args: ValidationArguments) {
          return `Field '${args.property}' must contains between ${minLength} and ${maxLength} digits`;
        },
      },
    });
  };
}
