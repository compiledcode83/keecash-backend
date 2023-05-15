import { Injectable } from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import * as bcrypt from 'bcrypt';
import { PersonProfileService } from '@app/person-profile';
import { AccountType, User } from '@app/user';
import { DocumentService } from '@app/document';
import { CreatePersonUserDto } from '@api/user/dto/create-person-user.dto';
import { UserRepository } from './user.repository';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';

const REFERRAL_ID_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const REFERRAL_ID_LENGTH = 7;

@Injectable()
export class UserService {
  private readonly generateReferralId: () => string;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly personProfileService: PersonProfileService,
    private readonly documentService: DocumentService,
  ) {
    this.generateReferralId = customAlphabet(REFERRAL_ID_ALPHABET, REFERRAL_ID_LENGTH);
  }

  async findOne(param: any): Promise<User> {
    return this.userRepository.findOne({ where: param });
  }

  async updatePersonalUser(body: UpdateUserInfoDto) {
    await this.userRepository.update(body.userId, {
      firstName: body.firstName,
      lastName: body.lastName,
      type: body.accountType,
      language: body.language,
    });

    const personProfile = await this.personProfileService.getByUserId(body.userId);
    await this.personProfileService.update(personProfile.id, {
      address1: body.address1,
      address2: body.address2,
      zipcode: body.zipcode,
      city: body.city,
    });

    return this.personProfileService.getPersonUserInfo(body.userId);
  }

  async createPersonalUser(body: CreatePersonUserDto) {
    let referralId;
    let referralIdDuplicated = true;

    while (referralIdDuplicated) {
      referralId = this.generateReferralId();
      const userExists = await this.userRepository.findOne({ where: { referralId } });
      if (!userExists) referralIdDuplicated = false;
    }

    const res = await this.userRepository.save({
      firstName: body.firstName,
      lastName: body.lastName,
      referralId,
      referralAppliedId: body?.referralAppliedId,
      email: body.email,
      phoneNumber: body.phoneNumber,
      language: body.language,
      type: AccountType.Person,
      password: await bcrypt.hash(body.password, 10),
    });

    const savedUser = await this.findOne({ id: res.id });

    await this.personProfileService.create({
      address1: body.address1,
      address2: body.address2,
      city: body.city,
      user: savedUser,
    });

    await this.documentService.save({
      userId: savedUser.id,
      type: body.documentType,
      imageLink: body.verificationImageLink,
    });

    return 'success';
  }
}
