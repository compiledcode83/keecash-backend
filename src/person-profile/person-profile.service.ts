import { Injectable } from '@nestjs/common';
import { PersonProfile } from './person-profile.entity';
import { PersonProfileRepository } from './person-profile.repository';

@Injectable()
export class PersonProfileService {
  constructor(private readonly personProfileRepository: PersonProfileRepository) {}

  async save(personProfile: Partial<PersonProfile>): Promise<void> {
    const personProfileEntity = this.personProfileRepository.create(personProfile);

    await this.personProfileRepository.save(personProfileEntity);
  }

  async update(id: number, data: Partial<PersonProfile>) {
    await this.personProfileRepository.update(id, data);
  }

  async getByUserId(userId: number): Promise<PersonProfile> {
    const personProfile = await this.personProfileRepository.findOne({
      where: { user: { id: userId } },
    });
    return personProfile;
  }

  async getPersonUserInfo(userId: string) {
    const userInfo = await this.personProfileRepository
      .createQueryBuilder('person_profile')
      .select([
        'user.id as id',
        'user.firstName as firstName',
        'user.secondName as secondName',
        'user.referralId as referralId',
        'user.referralAppliedId as referralAppliedId',
        'user.email as email',
        'user.phoneNumber as phoneNumber',
        'user.countryId as countryId',
        'user.language as language',
        'user.type as type',
        'user.status as status',
        'user.registeredAt as registeredAt',
        'user.approvedAt as approvedAt',
        'user.rejectedAt as rejectedAt',
        'user.language as language',
        'person_profile.address as address',
        'person_profile.city as city',
      ])
      .innerJoin('person_profile.user', 'user')
      .where(`user.email='${userId}'`)
      .getRawOne();

    return userInfo;
  }
}
