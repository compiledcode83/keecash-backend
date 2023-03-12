import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '@api/user/user.service';
import { BeneficiaryUserRepository } from './beneficiary-user.repository';
import { AddBeneficiaryUserDto } from './dto/add-beneficiary-user.dto';
import { BeneficiaryUser } from './beneficiary-user.entity';

@Injectable()
export class BeneficiaryUserService {
  constructor(
    private readonly beneficiaryUserRepository: BeneficiaryUserRepository,
    private readonly userService: UserService,
  ) {}

  async findByPayerId(payerId: number, isAdmin: boolean) {
    return this.beneficiaryUserRepository.findByPayerId(payerId, isAdmin);
  }

  async addBeneficiaryUser(body: AddBeneficiaryUserDto, userId: number): Promise<BeneficiaryUser> {
    const user = await this.userService.findByEmailPhoneNumberReferralId(body.beneficiaryUser);
    if (!user) throw new BadRequestException('Cannot find beneficiary user');

    const beneficiary = await this.beneficiaryUserRepository.save({
      payerId: userId,
      payeeId: user.id,
    });

    return beneficiary;
  }
}
