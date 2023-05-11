import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function BeneficiaryUserIdValidator(
  minLength: number,
  maxLength: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: number, propertyName: string) {
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
