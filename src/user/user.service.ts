import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserInfoDto } from '@src/admin/dto/update-user-info.dto';
import { AccessTokenInterfaceForUser } from '@src/auth/auth.type';
import { VerificationService } from '@src/verification/verification.service';
import * as bcrypt from 'bcrypt';
import { AddPersonUserInfoDto } from './dto/add-personal-user-info.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { CreateEnterpriseUserDto } from './dto/create-enterprise-user.dto';
import { CreatePersonUserDto } from './dto/create-person-user.dto';
import { SendPhoneNumberVerificationCodeDto } from './dto/send-phone-verification.dto';
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
import { AccountType, Status, User } from './table/user.entity';
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
    private readonly jwtService: JwtService,
    private readonly verificationService: VerificationService,
  ) {}

  async findCountryByName(name: string): Promise<Country> {
    const country = await this.countryRepository.findOne({
      where: { name },
    });
    return country;
  }

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
    const personProfile: Partial<PersonProfile> = {
      address: body.address,
      city: body.city,
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
      if (Object.keys(personalInfo).length !== 0)
        await this.personProfileRepository.update(
          personProfile.id,
          personalInfo,
        );
    }
    return this.getPersonUserInfo(user.email);
  }

  async createAccount(body: CreateAccountDto) {
    const referralId = await this.generateReferralId();
    const user: Partial<User> = {
      referralId: referralId,
      referralAppliedId: body?.referralAppliedId,
      email: body.email,
      language: body.language,
      type: AccountType.PERSON,
      password: await bcrypt.hash(body.password, 10),
    };
    const userEntity = this.userRepository.create(user);
    const res = await this.userRepository.save(userEntity, {
      reload: false,
    });
    const savedUser = await this.findOne(res.id);
    return savedUser;
  }

  async createAccessToken(user: User) {
    const payload: AccessTokenInterfaceForUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      secondName: user.secondName,
      status: user.status,
      type: user.type,
    };

    return { accessToken: await this.jwtService.signAsync(payload) };
  }

  async sendEmailOtp(email: string): Promise<string> {
    const user = await this.findByEmail(email);
    if (user.status === Status.REGISTERED) {
      const res = await this.verificationService.sendEmailVerificationCode(
        email,
      );
      if (res === true) {
        return 'Email verification code was successfully sent';
      }
    }
    throw new BadRequestException('Sorry, Can not send verification code');
  }

  async confirmEmailOtp(email: string, code: string): Promise<User> {
    const res = await this.verificationService.confirmEmailVerificationCode(
      email,
      code,
    );
    if (res) {
      await this.userRepository.update(
        { email: email },
        { status: Status.EMAIL_VALIDATED },
      );
      return this.findByEmail(email);
    }
    throw new BadRequestException(
      'Sorry, Can not confirm email verification code',
    );
  }

  async sendPhoneOtp(
    email: string,
    body: SendPhoneNumberVerificationCodeDto,
  ): Promise<string> {
    const user = await this.findByEmail(email);
    if (user.status === Status.EMAIL_VALIDATED) {
      const country = await this.findCountryByName(body.country);
      if (body.phoneNumber.startsWith(country.phoneCode)) {
        const res = await this.verificationService.sendPhoneVerificationCode(
          body.phoneNumber,
        );
        if (res === true) {
          await this.userRepository.update(
            { email: email },
            { phoneNumber: body.phoneNumber },
          );
          return 'Phone number verification code was successfully sent';
        }
      }
    }
    throw new BadRequestException('Sorry, Can not send verification code');
  }

  async confirmPhoneOtp(email: string, code: string): Promise<User> {
    const user = await this.findByEmail(email);
    const res =
      await this.verificationService.confirmPhoneNumberVerificationCode(
        user.phoneNumber,
        code,
      );
    if (res) {
      await this.userRepository.update(
        { email: email },
        { status: Status.PHONE_VALIDATED },
      );
      return this.findByEmail(email);
    }
    throw new BadRequestException('Sorry, Can not confirm phone number');
  }

  async getSumsubAccessToken() {
    return this.verificationService.createSumsubAccessToken('JamesBond007');
  }

  async addPersonalUserInfo(
    email: string,
    body: AddPersonUserInfoDto,
  ): Promise<User> {
    const user = await this.findByEmail(email);
    if (user.status === Status.PHONE_VALIDATED) {
      const country = await this.findCountryByName(body.country);
      await this.userRepository.update(
        { email },
        {
          firstName: body.firstName,
          secondName: body.secondName,
          countryId: country.id,
          status: Status.COMPLETED,
        },
      );
      const personProfile: Partial<PersonProfile> = {
        address: body.address,
        city: body.city,
        user: user,
      };
      const personProfileEntity =
        this.personProfileRepository.create(personProfile);
      await this.personProfileRepository.save(personProfileEntity);
      return this.findByEmail(email);
    }
    throw new BadRequestException('Please complete last steps');
  }

  async getCountryList() {
    const countryList = await this.countryRepository
      .createQueryBuilder('country')
      .select(['name', 'country_code', 'phone_code'])
      .getRawMany();
    return countryList;
  }
}
