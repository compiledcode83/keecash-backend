import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOne(param: any): Promise<User> {
    return this.userRepository.findOne({ where: param });
  }

  async findByUuid(uuid: string): Promise<User> {
    return this.userRepository.findOne({ where: { uuid } });
  }

  async findOneWithProfileAndDocuments(
    param: Partial<User>,
    withProfile: boolean,
    withDocuments: boolean,
  ) {
    return this.userRepository.findOneWithProfileAndDocuments(param, withProfile, withDocuments);
  }

  async getReferralUser(userId: number): Promise<User> {
    const { referralAppliedId } = await this.findOne({ id: userId });

    const referralUser = await this.userRepository
      .createQueryBuilder('user')
      .select('id')
      .where(`referral_id = '${referralAppliedId}'`)
      .getOne();

    return referralUser;
  }

  async update(param: any, data: Partial<User>) {
    return this.userRepository.update(param, data);
  }

  async completeWithError(uuid: string, errorData: string): Promise<void> {
    await this.userRepository.update({ uuid }, { errorData });
  }
}
