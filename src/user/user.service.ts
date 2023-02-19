import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserInfoDto } from '@src/admin/dto/update-user-info.dto';
import { AccessTokenInterfaceForUser } from '@src/auth/auth.type';
import { CountryService } from '@src/country/country.service';
import { DocumentService } from '@src/document/document.service';
import { DocumentTypeEnum } from '@src/document/document.types';
import { EnterpriseProfileService } from '@src/enterprise-profile/enterprise-profile.service';
import { PersonProfileService } from '@src/person-profile/person-profile.service';
import { ShareholderService } from '@src/shareholder/shareholder.service';
import { VerificationService } from '@src/verification/verification.service';
import * as bcrypt from 'bcrypt';
import { AddPersonUserInfoDto } from './dto/add-personal-user-info.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { CreateEnterpriseUserDto } from './dto/create-enterprise-user.dto';
import { CreatePersonUserDto } from './dto/create-person-user.dto';
import { SendPhoneNumberVerificationCodeDto } from './dto/send-phone-verification.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { AccountType, UserStatus } from './user.types';

const REFERRAL_ID_LENGTH = 7;

@Injectable()
export class UserService {
  constructor(
    private readonly countryService: CountryService,
    private readonly documentService: DocumentService,
    private readonly enterpriseProfileService: EnterpriseProfileService,
    private readonly personProfileService: PersonProfileService,
    private readonly shareholderservice: ShareholderService,
    private readonly jwtService: JwtService,
    private readonly verificationService: VerificationService,
    private readonly userRepository: UserRepository,
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

  async findByEmailPhonenumberReferralId(userInfo: string): Promise<User | null> {
    const userByEmail = await this.findByEmail(userInfo);
    if (userByEmail) return userByEmail;

    const userByPhonenumber = await this.findByPhonenumber(userInfo);
    if (userByPhonenumber) return userByPhonenumber;

    const userByReferralId = await this.findByReferralId(userInfo);
    if (userByReferralId) return userByReferralId;

    return null;
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
    await this.userRepository.update({ email }, { password: await bcrypt.hash(password, 10) });

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
      type: AccountType.Person,
      password: await bcrypt.hash(body.password, 10),
    };
    const userEntity = this.userRepository.create(user);
    const res = await this.userRepository.save(userEntity, {
      reload: false,
    });
    const savedUser = await this.findOne(res.id);

    await this.personProfileService.save({
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

  async createEnterpriseUser(body: CreateEnterpriseUserDto) {
    const referralId = await this.generateReferralId();
    const user: Partial<User> = {
      firstName: body.firstName,
      secondName: body.secondName,
      referralId: referralId,
      referralAppliedId: body?.referralAppliedId,
      email: body.email,
      language: body.language,
      type: AccountType.Enterprise,
      password: await bcrypt.hash(body.password, 10),
    };
    const userEntity = this.userRepository.create(user);
    const resUser = await this.userRepository.save(userEntity, {
      reload: false,
    });
    const savedUser = await this.findOne(resUser.id);
    const country = await this.countryService.findCountryByName(body.country);

    const enterpriseProfile = await this.enterpriseProfileService.save({
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
    });

    for (const shareholderItem of body.shareholders) {
      await this.shareholderservice.save({
        firstName: shareholderItem.firstName,
        secondName: shareholderItem.secondName,
        enterpriseProfileId: enterpriseProfile.id,
      });
    }
    {
      await this.documentService.save({
        userId: savedUser.id,
        type: body.documentType,
        imageLink: body.verificationImageLink,
      });
    }
    {
      await this.documentService.save({
        userId: savedUser.id,
        type: DocumentTypeEnum.UBO,
        imageLink: body.uboImageLink,
      });
    }
    {
      await this.documentService.save({
        userId: savedUser.id,
        type: DocumentTypeEnum.ProofCompanyRegistration,
        imageLink: body.companyRegisterationImageLink,
      });
    }

    return 'success';
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
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
    await this.userRepository.update(body.userId, {
      firstName: body.firstName,
      secondName: body.secondName,
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

  async createAccount(body: CreateAccountDto) {
    const referralId = await this.generateReferralId();
    const user: Partial<User> = {
      referralId: referralId,
      referralAppliedId: body?.referralAppliedId,
      email: body.email,
      language: body.language,
      type: AccountType.Person,
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
    if (user.status === UserStatus.Registered) {
      const res = await this.verificationService.sendEmailVerificationCode(email);
      if (res === true) {
        return 'Email verification code was successfully sent';
      }
    }
    throw new BadRequestException('Sorry, Can not send verification code');
  }

  async confirmEmailOtp(email: string, code: string): Promise<User> {
    const res = await this.verificationService.confirmEmailVerificationCode(email, code);
    if (res) {
      await this.userRepository.update({ email: email }, { status: UserStatus.EmailValidated });

      return this.findByEmail(email);
    }
    throw new BadRequestException('Sorry, Can not confirm email verification code');
  }

  async sendPhoneOtp(email: string, body: SendPhoneNumberVerificationCodeDto): Promise<string> {
    const user = await this.findByEmail(email);
    if (user.status === UserStatus.EmailValidated) {
      const country = await this.countryService.findCountryByName(body.country);
      if (body.phoneNumber.startsWith(country.phoneCode)) {
        const res = await this.verificationService.sendPhoneVerificationCode(body.phoneNumber);
        if (res === true) {
          await this.userRepository.update({ email: email }, { phoneNumber: body.phoneNumber });

          return 'Phone number verification code was successfully sent';
        }
      }
    }
    throw new BadRequestException('Sorry, Can not send verification code');
  }

  async confirmPhoneOtp(email: string, code: string): Promise<User> {
    const user = await this.findByEmail(email);
    const res = await this.verificationService.confirmPhoneNumberVerificationCode(
      user.phoneNumber,
      code,
    );
    if (res) {
      await this.userRepository.update({ email: email }, { status: UserStatus.PhoneValidated });

      return this.findByEmail(email);
    }
    throw new BadRequestException('Sorry, Can not confirm phone number');
  }

  async getSumsubAccessToken() {
    return this.verificationService.createSumsubAccessToken('JamesBond007');
  }

  async addPersonalUserInfo(email: string, body: AddPersonUserInfoDto): Promise<User> {
    const user = await this.findByEmail(email);
    if (user.status === UserStatus.PhoneValidated) {
      await this.userRepository.update(
        { email },
        {
          firstName: body.firstName,
          secondName: body.secondName,
          status: UserStatus.Completed,
        },
      );

      const country = await this.countryService.findCountryByName(body.country);

      await this.personProfileService.save({
        address1: body.address1,
        address2: body.address2,
        city: body.city,
        countryId: country.id,
        user: user,
      });

      return this.findByEmail(email);
    }
    throw new BadRequestException('Please complete last steps');
  }
}
