import { Injectable } from '@nestjs/common';
import { PersonProfile } from './person-profile.entity';
import { PersonProfileRepository } from './person-profile.repository';

@Injectable()
export class PersonProfileService {
  constructor(private readonly personProfileRepository: PersonProfileRepository) {}

  async create(personProfile: Partial<PersonProfile>): Promise<void> {
    const personProfileEntity = this.personProfileRepository.create(personProfile);

    await this.personProfileRepository.create(personProfileEntity);
  }

  async update(id: number, data: Partial<PersonProfile>) {
    await this.personProfileRepository.update(id, data);
  }

  async getByUserId(userId: number): Promise<PersonProfile> {
    const personProfile = await this.personProfileRepository.findOne({ where: { userId } });

    return personProfile;
  }

  async getPersonUserInfo(userId: number) {
    const userInfo = await this.personProfileRepository
      .createQueryBuilder('person_profile')
      .select([
        'user.id as id',
        'user.firstName as first_name',
        'user.lastName as second_name',
        'user.referralId as referral_id',
        'user.referralAppliedId as referral_applied_id',
        'user.email as email',
        'user.phoneNumber as phone_number',
        'user.language as language',
        'user.type as type',
        'user.status as status',
        'user.registeredAt as registered_at',
        'user.approvedAt as approved_at',
        'user.rejectedAt as rejected_at',
        'user.language as language',
        'person_profile.address1 as address1',
        'person_profile.address2 as address2',
        'person_profile.zipcode as zipcode',
        'person_profile.city as city',
        'person_profile.countryId as country_id',
        'country.countryCode as country_code',
      ])
      .innerJoin('person_profile.user', 'user')
      .innerJoin('person_profile.country', 'country')
      .where(`user.id='${userId}'`)
      .getRawOne();

    return userInfo;
  }
}
