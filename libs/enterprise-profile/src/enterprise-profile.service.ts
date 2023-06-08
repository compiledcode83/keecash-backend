import { Injectable } from '@nestjs/common';
import { EnterpriseProfile } from './enterprise-profile.entity';
import { EnterpriseProfileRepository } from './enterprise-profile.repository';

@Injectable()
export class EnterpriseProfileService {
  constructor(private readonly enterpriseProfileRepository: EnterpriseProfileRepository) {}

  async save(enterpriseProfile: Partial<EnterpriseProfile>): Promise<EnterpriseProfile> {
    const enterpriseProfileEntity = this.enterpriseProfileRepository.create(enterpriseProfile);
    const resEnterpriseProfile = await this.enterpriseProfileRepository.save(
      enterpriseProfileEntity,
    );

    return this.enterpriseProfileRepository.findOne({
      where: { id: resEnterpriseProfile.id },
    });
  }

  async getByUserId(userId: number): Promise<EnterpriseProfile> {
    const enterpriseProfile = await this.enterpriseProfileRepository.findOne({ where: { userId } });

    return enterpriseProfile;
  }
}
