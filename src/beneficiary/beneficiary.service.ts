import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '@src/user/user.service';
import { AddBeneficiaryUserDto } from './dto/add-beneficiary-user.dto';
import { BeneficiaryUser } from './table/beneficiary-user.entity';
import { BeneficiaryUserRepository } from './table/beneficiary-user.repository';

@Injectable()
export class BeneficiaryService {
  constructor(
    private readonly beneficiaryUserRepository: BeneficiaryUserRepository,
    private readonly userService: UserService,
  ) {}

  async addBeneficiaryUser(body: AddBeneficiaryUserDto, userId: number) {
    const beneficiaryUser =
      await this.userService.findByEmailPhonenumberReferralId(
        body.beneficiaryUser,
      );
    if (beneficiaryUser) {
      const newBeneficiaryUser: Partial<BeneficiaryUser> = {
        userId: userId,
        beneficiaryUserId: beneficiaryUser.id,
      };
      const beneficiaryUserEntity =
        this.beneficiaryUserRepository.create(newBeneficiaryUser);
      await this.beneficiaryUserRepository.save(beneficiaryUserEntity);
      return 'Success';
    }
    throw new BadRequestException('Can not find beneficiary user');
  }
}
