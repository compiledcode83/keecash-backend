import { Injectable } from '@nestjs/common';
import { UpdateUserInfoDto } from '@src/admin/dto/update-user-info.dto';
import * as bcrypt from 'bcrypt';
import { CreateEnterpriseUserDto } from './dto/create-enterprise-user.dto';
import { CreatePersonUserDto } from './dto/create-person-user.dto';
import { Country } from './table/country.entity';
import { CountryRepository } from './table/country.repository';
import { DOCUEMNT_TYPE, Document } from './table/document.entity';
import { DocumentRepository } from './table/document.repository';
import { EnterpriseProfile } from './table/enterprise-profile.entity';
import { EnterpriseProfileRepository } from './table/enterprise-profile.repository';
import { PersonProfile } from './table/person-profile.entity';
import { PersonProfileRepository } from './table/person-profile.repository';
import { Shareholder } from './table/shareholder.entity';
import { ShareholderRepository } from './table/shareholder.repository';
import { AccountType, User } from './table/user.entity';
import { UserRepository } from './table/user.repository';

const REFERRAL_ID_LENGTH = 7;

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly personProfileRepository: PersonProfileRepository,
    private readonly countryRepository: CountryRepository,
    private readonly documentRepository: DocumentRepository,
    private readonly enterpriseProfileRepository: EnterpriseProfileRepository,
    private readonly shareholderRepository: ShareholderRepository,
  ) {}

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByPhonenumber(phoneNumber: string): Promise<User> {
    return this.userRepository.findOne({ where: { phoneNumber } });
  }

  async findByReferralId(referralId: string): Promise<User> {
    return this.userRepository.findOne({ where: { referralId } });
  }

  async getPersonProfileByUserId(userId: number): Promise<PersonProfile> {
    const personProfile = await this.personProfileRepository.findOne({
      where: { user: { id: userId } },
    });
    return personProfile;
  }

  async findByEmailPhonenumberReferralId(
    userInfo: string,
  ): Promise<User | null> {
    const userByEmail = await this.findByEmail(userInfo);
    if (userByEmail) return userByEmail;
    const userByPhonenumber = await this.findByPhonenumber(userInfo);
    if (userByPhonenumber) return userByPhonenumber;
    const userByReferralId = await this.findByReferralId(userInfo);
    if (userByReferralId) return userByReferralId;
    return null;
  }

  async getPersonUserInfo(userId: string) {
    const userInfo = await this.personProfileRepository
      .createQueryBuilder('person_profile')
      .innerJoinAndSelect('person_profile.user', 'user')
      .where(`user.email='${userId}'`)
      .getRawOne();
    return userInfo;
  }

  async getReferralUserId(userId: number): Promise<number | null> {
    const { referralAppliedId } = await this.findOne(userId);
    const referralUser = await this.userRepository
      .createQueryBuilder('user')
      .select('id')
      .where(`referral_id = '${referralAppliedId}'`)
      .getRawOne();
    if (referralUser) return referralUser.id;
    return null;
  }

  async passwordReset(email: string, password: string): Promise<boolean> {
    await this.userRepository.update(
      { email },
      { password: await bcrypt.hash(password, 10) },
    );
    return true;
  }

  async createPersonalUser(body: CreatePersonUserDto) {
    const referralId = await this.generateReferralId();
    const user: Partial<User> = {
      firstName: body.firstName,
      secondName: body.secondName,
      referralId: referralId,
      referralAppliedId: body?.referralAppliedId,
      email: body.email,
      phoneNumber: body.phoneNumber,
      language: body.language,
      type: AccountType.PERSON,
      password: await bcrypt.hash(body.password, 10),
    };
    const userEntity = this.userRepository.create(user);
    const res = await this.userRepository.save(userEntity, {
      reload: false,
    });
    const savedUser = await this.findOne(res.id);
    const country = await this.findOneCountryByName(body.country);
    const personProfile: Partial<PersonProfile> = {
      address: body.address,
      zipcode: body.zipcode,
      city: body.city,
      countryId: country.id,
      user: savedUser,
    };
    const personProfileEntity =
      this.personProfileRepository.create(personProfile);
    await this.personProfileRepository.save(personProfileEntity);
    const document: Partial<Document> = {
      userId: savedUser.id,
      type: body.documentType,
      imageLink: body.verificationImageLink,
    };
    const documentEntity = this.documentRepository.create(document);
    await this.documentRepository.save(documentEntity);
    return 'success';
  }

  async createEnterpriseUser(body: CreateEnterpriseUserDto) {
    const referralId = await this.generateReferralId();
    const user: Partial<User> = {
      firstName: body.firstName,
      secondName: body.secondName,
      referralId: referralId,
      referralAppliedId: body?.referralAppliedId,
      email: body.email,
      language: body.language,
      type: AccountType.ENTERPRISE,
      password: await bcrypt.hash(body.password, 10),
    };
    const userEntity = this.userRepository.create(user);
    const resUser = await this.userRepository.save(userEntity, {
      reload: false,
    });
    const savedUser = await this.findOne(resUser.id);
    const country = await this.findOneCountryByName(body.country);
    const enterpriseProfile: Partial<EnterpriseProfile> = {
      position: body.position,
      entityType: body.entityType,
      companyName: body.companyName,
      countryId: country.id,
      companyRegisterationNumber: body.companyRegisterationNumber,
      vatNumber: body.vatNumber,
      address1: body.address1,
      address2: body.address2,
      zipcode: body.zipcode,
      city: body.city,
      user: savedUser,
    };
    const enterpriseProfileEntity =
      this.enterpriseProfileRepository.create(enterpriseProfile);
    const resEnterpriseProfile = await this.enterpriseProfileRepository.save(
      enterpriseProfileEntity,
    );
    const savedEnterpriseProfile =
      await this.enterpriseProfileRepository.findOne({
        where: { id: resEnterpriseProfile.id },
      });
    for (const shareholderItem of body.shareholders) {
      const shareholder: Partial<Shareholder> = {
        firstName: shareholderItem.firstName,
        secondName: shareholderItem.secondName,
        enterpriseProfileId: savedEnterpriseProfile.id,
      };
      const shareholderEntity = this.shareholderRepository.create(shareholder);
      await this.shareholderRepository.save(shareholderEntity);
    }
    {
      const document: Partial<Document> = {
        userId: savedUser.id,
        type: body.documentType,
        imageLink: body.verificationImageLink,
      };
      const documentEntity = this.documentRepository.create(document);
      await this.documentRepository.save(documentEntity);
    }
    {
      const document: Partial<Document> = {
        userId: savedUser.id,
        type: DOCUEMNT_TYPE.UBO,
        imageLink: body.uboImageLink,
      };
      const documentEntity = this.documentRepository.create(document);
      await this.documentRepository.save(documentEntity);
    }
    {
      const document: Partial<Document> = {
        userId: savedUser.id,
        type: DOCUEMNT_TYPE.PROOF_COMPANY_REGISTERATION,
        imageLink: body.companyRegisterationImageLink,
      };
      const documentEntity = this.documentRepository.create(document);
      await this.documentRepository.save(documentEntity);
    }
    return 'success';
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findOneCountryByName(name: string): Promise<Country> {
    return this.countryRepository.findOne({ where: { name: name } });
  }

  async generateReferralId(): Promise<string> {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < REFERRAL_ID_LENGTH; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async updatePersonalUser(body: UpdateUserInfoDto) {
    const user = await this.findByEmail(body.email);
    {
      const userInfo: Partial<User> = {};
      if (body.firstName) userInfo.firstName = body.firstName;
      if (body.secondName) userInfo.secondName = body.secondName;
      if (body.accountType) userInfo.type = body.accountType;
      if (body.status) userInfo.status = body.status;
      if (body.language) userInfo.language = body.language;
      if (Object.keys(userInfo).length !== 0)
        await this.userRepository.update(user.id, userInfo);
    }
    {
      const personProfile = await this.getPersonProfileByUserId(user.id);
      const personalInfo: Partial<PersonProfile> = {};
      if (body.address) personalInfo.address = body.address;
      if (body.city) personalInfo.city = body.city;
      if (body.zipcode) personalInfo.zipcode = body.zipcode;
      if (Object.keys(personalInfo).length !== 0)
        await this.personProfileRepository.update(
          personProfile.id,
          personalInfo,
        );
    }
    return this.getPersonUserInfo(user.email);
  }
}
