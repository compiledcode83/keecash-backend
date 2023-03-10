import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '@src/user/user.service';
import { BeneficiaryUserRepository } from './beneficiary-user.repository';
import { AddBeneficiaryUserDto } from './dto/add-beneficiary-user.dto';

@Injectable()
export class BeneficiaryUserService {
  constructor(
    private readonly beneficiaryUserRepository: BeneficiaryUserRepository,
    private readonly userService: UserService,
  ) {}

  async getByPayerId(payerId: number) {
    return this.beneficiaryUserRepository.getByPayerId(payerId);
  }

  async addBeneficiaryUser(body: AddBeneficiaryUserDto, userId: number): Promise<string> {
    const beneficiaryUser = await this.userService.findByEmailPhonenumberReferralId(
      body.beneficiaryUser,
    );
    if (beneficiaryUser) {
      await this.beneficiaryUserRepository.save({ payerId: userId, payeeId: beneficiaryUser.id });

      return 'Success';
    }
    throw new BadRequestException('Cannot find beneficiary user');
  }
}
