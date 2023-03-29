import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUserInfoDto } from '@admin/admin/dto/update-user-info.dto';
import { CountryService } from '@api/country/country.service';
import { DocumentService } from '@api/user/document/document.service';
import { DocumentTypeEnum } from '@api/user/document/document.types';
import { EnterpriseProfileService } from '@api/user/enterprise-profile/enterprise-profile.service';
import { PersonProfileService } from '@api/user/person-profile/person-profile.service';
import { ShareholderService } from '@api/shareholder/shareholder.service';
import { VerificationService } from '@api/verification/verification.service';
import * as bcrypt from 'bcrypt';
import { AddPersonUserInfoDto } from './dto/add-personal-user-info.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateEnterpriseUserDto } from './dto/create-enterprise-user.dto';
import { CreatePersonUserDto } from './dto/create-person-user.dto';
import { SendPhoneNumberVerificationCodeDto } from '../verification/dto/send-phone-verification.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { AccountType, Language, UserStatus } from './user.types';
import { ClosureReasonService } from '../closure-reason/closure-reason.service';
import { TransactionService } from '../transaction/transaction.service';
import { CardService } from '../card/card.service';
import { CloseAccountDto } from './dto/close-account.dto';

const closure_reasons = require('../closure-reason/closure-reasons.json');

const REFERRAL_ID_LENGTH = 7;

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly countryService: CountryService,
    private readonly documentService: DocumentService,
    private readonly enterpriseProfileService: EnterpriseProfileService,
    private readonly personProfileService: PersonProfileService,
    private readonly shareholderservice: ShareholderService,
    private readonly verificationService: VerificationService,
    private readonly closureReasonService: ClosureReasonService,
    private readonly transactionService: TransactionService,
    private readonly cardService: CardService,
  ) {}

  async findOne(params: any): Promise<User> {
    return this.userRepository.findOne({ where: params });
  }

  async findByEmailPhoneNumberReferralId(userInfo: string): Promise<User | null> {
    console.log({ userInfo });
    const userByEmail = await this.findOne({ email: userInfo });
    if (userByEmail) return userByEmail;

    const userByPhonenumber = await this.findOne({ phoneNumber: userInfo });
    if (userByPhonenumber) return userByPhonenumber;

    const userByReferralId = await this.findOne({ referralId: userInfo });
    if (userByReferralId) return userByReferralId;

    return null;
  }

  async getReferralUserId(userId: number): Promise<number | null> {
    const { referralAppliedId } = await this.findOne({ id: userId });

    const referralUser = await this.userRepository
      .createQueryBuilder('user')
      .select('id')
      .where(`referral_id = '${referralAppliedId}'`)
      .getRawOne();

    return referralUser.id;
  }

  async getReferredUsersByReferralId(referralId: string): Promise<Partial<User>[]> {
    const referredUsers = await this.userRepository
      .createQueryBuilder('user')
      .select(['email', 'status', 'registered_at as created_at', 'registered_at as updated_at'])
      .where(`referral_applied_id = '${referralId}'`)
      .getRawMany();

    return referredUsers;
  }

  async update(id: number, data: Partial<User>) {
    return this.userRepository.update(id, data);
  }

  async resetPassword(userId: number, password: string): Promise<boolean> {
    await this.userRepository.update({ id: userId }, { password: await bcrypt.hash(password, 10) });

    return true;
  }

  async createPersonalUser(body: CreatePersonUserDto) {
    const referralId = await this.generateReferralId();

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

    const newUser = await this.userRepository.save({
      firstName: body.firstName,
      lastName: body.lastName,
      referralId,
      referralAppliedId: body?.referralAppliedId,
      email: body.email,
      language: body.language,
      type: AccountType.Enterprise,
      password: await bcrypt.hash(body.password, 10),
    });

    const savedUser = await this.findOne({ id: newUser.id });
    const country = await this.countryService.findOne({ name: body.country });

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
        lastName: shareholderItem.lastName,
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

  async createAccount(body: CreateUserDto) {
    const referralId = await this.generateReferralId();

    const user: Partial<User> = {
      referralId,
      referralAppliedId: body.referralAppliedId,
      email: body.email,
      language: body.language,
      type: AccountType.Person,
      password: await bcrypt.hash(body.password, 10),
    };

    const newUser = await this.userRepository.save(user);

    return newUser;
  }

  async sendEmailOtp(email: string): Promise<string> {
    const user = await this.findOne({ email });
    if (user.status === UserStatus.Registered) {
      const res = await this.verificationService.sendEmailVerificationCode(email);
      if (res === true) {
        return 'Email verification code was successfully sent';
      }
    }
    throw new BadRequestException('Cannot send verification code');
  }

  async confirmEmailOtp(email: string, code: string): Promise<User> {
    const res = await this.verificationService.confirmEmailVerificationCode(email, code);

    if (!res) {
      throw new BadRequestException('Cannot confirm email verification code');
    }

    await this.userRepository.update({ email }, { emailValidated: true });

    return this.findOne({ email });
  }

  async confirmEmailOtpForForgotPassword(email: string, code: string): Promise<void> {
    const res = await this.verificationService.confirmEmailVerificationCode(email, code);

    if (!res) {
      throw new BadRequestException('Cannot confirm email verification code');
    }
  }

  async sendPhoneOtp(email: string, body: SendPhoneNumberVerificationCodeDto): Promise<boolean> {
    const user = await this.findOne({ email });

    if (!user) {
      throw new InternalServerErrorException('Error occured while getting user data');
    }

    if (!user.emailValidated) {
      throw new BadRequestException('Email is not validated yet');
    }

    if (user.phoneValidated) {
      throw new BadRequestException('Phone number is already validated');
    }

    const country = await this.countryService.findOne({ name: body.country });

    if (!body.phoneNumber.startsWith(country.phoneCode)) {
      throw new BadRequestException('Phone number format is incorrect');
    }

    const res = await this.verificationService.sendPhoneVerificationCode(body.phoneNumber);

    if (!res) {
      throw new InternalServerErrorException('Error occured while getting user data');
    }

    const updatedUser = await this.userRepository.update(
      { email },
      { phoneNumber: body.phoneNumber },
    );

    if (updatedUser.affected) return true;

    return false;
  }

  async confirmPhoneOtp(email: string, code: string): Promise<User> {
    const user = await this.findOne({ email });
    const res = await this.verificationService.confirmPhoneNumberVerificationCode(
      user.phoneNumber,
      code,
    );
    if (res) {
      await this.userRepository.update({ email }, { phoneValidated: true });

      return this.findOne({ email });
    }
    throw new BadRequestException('Sorry, Can not confirm phone number');
  }

  async getSumsubAccessToken() {
    return this.verificationService.createSumsubAccessToken('JamesBond007');
  }

  async addPersonalUserInfo(email: string, body: AddPersonUserInfoDto): Promise<User> {
    const user = await this.findOne({ email });
    if (user.phoneValidated) {
      await this.userRepository.update(
        { email },
        {
          firstName: body.firstName,
          lastName: body.lastName,
          status: UserStatus.Completed,
        },
      );

      const country = await this.countryService.findOne({ name: body.country });

      await this.personProfileService.save({
        address1: body.address1,
        address2: body.address2,
        city: body.city,
        countryId: country.id,
        user: user,
      });

      return this.findOne({ email });
    }
    throw new BadRequestException('Please complete last steps');
  }

  async setPincode(userId: number, pincode: string): Promise<void> {
    try {
      const encryptedPincode = await bcrypt.hash(pincode, 10);

      await this.userRepository.update(
        { id: userId },
        { pincode: encryptedPincode, pincodeSet: true },
      );
    } catch (error) {
      throw error;
    }
  }

  async resetPincode(userId: number): Promise<void> {
    const updatedUser = await this.userRepository.update(
      { id: userId },
      { pincode: null, pincodeSet: false },
    );

    if (!updatedUser.affected) throw new Error('Error occured while resetting pincode');
  }

  async getAccountSettings(userId: number): Promise<any> {
    const user = await this.userRepository.findOneBy({ id: userId });

    let countryId;

    switch (user.type) {
      case AccountType.Person:
        const personProfile = await this.personProfileService.getByUserId(userId);
        countryId = personProfile.countryId;
        break;

      case AccountType.Enterprise:
        const enterpriseProfile = await this.enterpriseProfileService.getByUserId(userId);
        countryId = enterpriseProfile.countryId;
        break;
    }

    const { countryCode } = await this.countryService.findOne({ id: countryId });

    const defaultReasons = closure_reasons;

    if (user.status === UserStatus.Closed) {
      const reasonIds = await this.closureReasonService.findByUserId(userId);

      reasonIds.map((reasonId) => {
        console.log({ reasonId });
        defaultReasons[reasonId - 1].is_checked = true;
      });
    }

    const keecash_wallets = await this.transactionService.getBalanceArrayByCurrency(userId);

    const cards = await this.cardService.getCardListByUserId(userId);

    const userSetting = {
      firstname: user.firstName,
      lastname: user.lastName,
      url_avatar: user.urlAvatar,
      email: user.email,
      country_code: countryCode,
      phone_number: user.phoneNumber,
      account_level: user.type,
      list_lang: [
        { lang: 'fr', is_checked: user.language === Language.French },
        { lang: 'en', is_checked: user.language === Language.English },
      ],
      list_reason_to_close_account: defaultReasons,
      keecash_wallets,
      cards: cards.map(({ name, balance, currency, brand }) => ({
        card_name: name,
        balance,
        currency,
        card_brand: brand,
      })),
    };

    return userSetting;
  }

  async closeAccount(
    userId: number,
    closureReasons: string[],
    leavingMessage: string,
    password: string,
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    console.log('user.password:', user.password);
    console.log('password:', password);

    const isPasswordValidated = await bcrypt.compare(password, user.password);

    if (!isPasswordValidated) throw new UnauthorizedException('Incorrect password');

    await this.userRepository.update(userId, { status: UserStatus.Closed, leavingMessage });

    await this.closureReasonService.createMany(userId, closureReasons);
  }

  async findUserAndSendOtp(params: Partial<User>) {
    const user = await this.userRepository.findOne({ where: params });

    if (!user) throw new UnauthorizedException('Cannot find user');

    await this.verificationService.sendEmailVerificationCode(user.email);
  }

  async confirmEmailChangeOtp(userId: number, newEmail: string, otp: string) {
    const res = await this.verificationService.confirmEmailVerificationCode(newEmail, otp);

    if (!res) {
      throw new BadRequestException('Cannot confirm email verification code');
    }

    await this.userRepository.update(userId, { email: newEmail });
  }
}
