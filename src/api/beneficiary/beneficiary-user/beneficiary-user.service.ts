import { Injectable } from '@nestjs/common';
import { BeneficiaryUserRepository } from './beneficiary-user.repository';
import { BeneficiaryUser } from './beneficiary-user.entity';

@Injectable()
export class BeneficiaryUserService {
  constructor(private readonly beneficiaryUserRepository: BeneficiaryUserRepository) {}

  async findByPayerId(payerId: number, isAdmin: boolean) {
    return this.beneficiaryUserRepository.findByPayerId(payerId, isAdmin);
  }

  async create(param: Partial<BeneficiaryUser>): Promise<BeneficiaryUser> {
    const beneficiaryUserEntity = await this.beneficiaryUserRepository.create(param);

    return this.beneficiaryUserRepository.save(beneficiaryUserEntity);
  }
}
