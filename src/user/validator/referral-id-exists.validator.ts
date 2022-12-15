import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserService } from '../user.service';

@ValidatorConstraint({ name: 'userExistsByEmailValidator', async: true })
export class ReferralIdExistsValidator implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}

  async validate(
    referralApplieId: string,
    args: ValidationArguments,
  ): Promise<boolean> {
    const userExists = await this.userService.findByReferralId(
      referralApplieId,
    );

    return Boolean(userExists);
  }

  defaultMessage(args: ValidationArguments) {
    return `The referral id '${args.value}' doesn't exist`;
  }
}
