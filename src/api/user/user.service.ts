import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { UpdateUserInfoDto } from '@admin/admin/dto/update-user-info.dto';
import { CountryService } from '@api/country/country.service';
import { DocumentService } from '@api/user/document/document.service';
import { DocumentTypeEnum } from '@api/user/document/document.types';
import { EnterpriseProfileService } from '@api/user/enterprise-profile/enterprise-profile.service';
import { PersonProfileService } from '@api/user/person-profile/person-profile.service';
import { ShareholderService } from '@api/shareholder/shareholder.service';
import { VerificationService } from '@api/verification/verification.service';
import * as bcrypt from 'bcrypt';
import { SubmitKycInfoDto } from './dto/submit-kyc-info.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateEnterpriseUserDto } from './dto/create-enterprise-user.dto';
import { CreatePersonUserDto } from './dto/create-person-user.dto';
import { SendPhoneNumberVerificationCodeDto } from '@api/verification/dto/send-phone-verification.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { AccountType, Language, UserStatus, VerificationStatus } from './user.types';
import { ClosureReasonService } from '@api/closure-reason/closure-reason.service';
import { TransactionService } from '@api/transaction/transaction.service';
import { CardService } from '@api/card/card.service';
import { BridgecardService } from '@api/bridgecard/bridgecard.service';

const closure_reasons = require('../closure-reason/closure-reasons.json');

const REFERRAL_ID_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const REFERRAL_ID_LENGTH = 7;

@Injectable()
export class UserService {
  private readonly generateReferralId: () => string;

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
    private readonly bridgecardService: BridgecardService,
    @Inject(forwardRef(() => CardService)) private readonly cardService: CardService,
  ) {
    this.generateReferralId = customAlphabet(REFERRAL_ID_ALPHABET, REFERRAL_ID_LENGTH);
  }

  async findOne(param: any): Promise<User> {
    return this.userRepository.findOne({ where: param });
  }

  async findByEmailPhoneNumberReferralId(userInfo: string): Promise<User> {
    return this.userRepository.findOne({
      where: [{ email: userInfo }, { phoneNumber: userInfo }, { referralId: userInfo }],
    });
  }

  async findOneWithProfileAndDocuments(
    param: Partial<User>,
    withProfile: boolean,
    withDocuments: boolean,
  ) {
    const user = await this.userRepository.findOneWithProfileAndDocuments(
      param,
      withProfile,
      withDocuments,
    );

    if (withProfile && !user.personProfile) {
      throw new NotFoundException('Cannot find profile data for this user');
    }

    if (withDocuments && !user.documents.length) {
      throw new NotFoundException('Cannot find any documents for this user');
    }

    return user;
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

  async getReferredUsersByReferralId(referralId: string): Promise<Partial<User>[]> {
    const referredUsers = await this.userRepository
      .createQueryBuilder('user')
      .select(['email', 'status', 'registered_at as created_at', 'registered_at as updated_at'])
      .where(`referral_applied_id = '${referralId}'`)
      .getRawMany();

    return referredUsers;
  }

  async create(body: CreateUserDto): Promise<User> {
    const referralId = this.generateReferralId();
    // TODO: Add DB check for referral id duplication.

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

  async update(param: any, data: Partial<User>) {
    return this.userRepository.update(param, data);
  }

  async resetPassword(userId: number, password: string): Promise<boolean> {
    await this.userRepository.update({ id: userId }, { password: await bcrypt.hash(password, 10) });

    return true;
  }

  async createPersonalUser(body: CreatePersonUserDto) {
    const referralId = this.generateReferralId();
    // TODO: Add DB check for referral id duplication.

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
    const referralId = this.generateReferralId();
    // TODO: Add DB check for referral id duplication.

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

  async sendEmailOtp(userId: number): Promise<boolean> {
    const user = await this.findOne({ id: userId });

    if (user.emailValidated) {
      throw new BadRequestException('Email is already validated');
    }

    const res = await this.verificationService.sendEmailVerificationCode(user.email);

    if (!res) {
      throw new BadRequestException('Cannot send email OTP');
    }

    return true;
  }

  async confirmEmailOtp(email: string, code: string): Promise<boolean> {
    const res = await this.verificationService.confirmEmailVerificationCode(email, code);

    if (!res) {
      throw new BadRequestException('Cannot confirm email verification code');
    }

    const updatedUser = await this.userRepository.update({ email }, { emailValidated: true });

    if (updatedUser.affected) return true;

    return false;
  }

  async confirmEmailOtpForForgotPassword(email: string, code: string): Promise<void> {
    const res = await this.verificationService.confirmEmailVerificationCode(email, code);

    if (!res) {
      throw new BadRequestException('Cannot confirm email verification code');
    }
  }

  async sendPhoneOtp(userId: number, body: SendPhoneNumberVerificationCodeDto): Promise<boolean> {
    const user = await this.findOne({ id: userId });

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

    const updatedUser = await this.userRepository.update(userId, { phoneNumber: body.phoneNumber });

    if (updatedUser.affected) return true;

    return false;
  }

  async confirmPhoneOtp(userId: number, code: string): Promise<boolean> {
    const user = await this.findOne({ id: userId });

    const res = await this.verificationService.confirmPhoneNumberVerificationCode(
      user.phoneNumber,
      code,
    );

    if (!res) {
      throw new BadRequestException('Sorry, Can not confirm phone number');
    }

    const updatedUser = await this.userRepository.update(userId, { phoneValidated: true });

    if (updatedUser.affected) return true;

    return false;
  }

  async getSumsubAccessToken() {
    return this.verificationService.createSumsubAccessToken('JamesBond007');
  }

  async submitKycInfo(userId: number, body: SubmitKycInfoDto): Promise<void> {
    const user = await this.findOne({ id: userId });

    if (!user.emailValidated || !user.phoneValidated) {
      throw new BadRequestException('Email or phone is not verified yet');
    }

    const { id: countryId } = await this.countryService.findOne({ name: body.country });

    await this.personProfileService.save({
      address1: body.address1,
      address2: body.address2,
      city: body.city,
      countryId,
      userId,
    });

    await this.userRepository.update(userId, {
      firstName: body.firstName,
      lastName: body.lastName,
      kycStatus: VerificationStatus.Pending,
    });
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

    const isPasswordValidated = await bcrypt.compare(password, user.password);

    if (!isPasswordValidated) throw new UnauthorizedException('Incorrect password');

    await this.userRepository.update(userId, { status: UserStatus.Closed, leavingMessage });

    await this.closureReasonService.createMany(userId, closureReasons);
  }

  async confirmEmailChangeOtp(userId: number, newEmail: string, otp: string) {
    const res = await this.verificationService.confirmEmailVerificationCode(newEmail, otp);

    if (!res) {
      throw new BadRequestException('Cannot confirm email verification code');
    }

    await this.userRepository.update(userId, { email: newEmail });
  }

  async completeAccount(userId: number) {
    await this.userRepository.update(userId, {
      kycStatus: VerificationStatus.Validated,
    });

    const user = await this.findOneWithProfileAndDocuments({ id: userId }, true, true);

    // const body = {
    //   first_name: user.firstName,
    //   last_name: user.lastName,
    //   address: {
    //     address: user.personProfile.address1,
    //     city: user.personProfile.city,
    //     state: '',
    //     country: user.personProfile.country.name,
    //     postal_code: user.personProfile.zipcode,
    //     house_no: user.personProfile.address2,
    //   },
    //   phone: user.phoneNumber,
    //   email_address: user.email,
    //   identity: {
    //     id_type: 'UNITED_STATES_DRIVERS_LICENSE', // user.documents[0].type
    //     id_no: '',
    //     id_image: user.documents[0].imageLink,
    //     bvn: '',
    //   },
    //   meta_data: {
    //     keecash_user_id: user.id,
    //   },
    // };

    const body = {
      first_name: 'HOL',
      last_name: 'MAYISSA BOUSSAMBA',
      address: {
        address: 'Libreville',
        city: 'Libreville',
        state: 'Estuaire',
        country: 'Gabon',
        postal_code: '24100',
        house_no: '01',
      },
      phone: '24166283620',
      email_address: 'buy@keecash.com',
      identity: {
        id_type: 'GABON_PASSPORT',
        id_no: '19GA17139',
        id_image:
          'https://firebasestorage.googleapis.com/v0/b/bridgecard-issuing.appspot.com/o/Screenshot%202023-02-16%20at%206.46.36%20PM.png?alt=media&token=d90d7c36-e761-4edf-9abc-c77791af846a',
        selfie_image:
          'https://firebasestorage.googleapis.com/v0/b/keecash-8b2cc.appspot.com/o/users%2FdZ5Ja2yRXcQBjHOnWU2HGXz0Lir1%2Fhol_selfie.jpg?alt=media&token=66426d57-91aa-4196-abde-a799cfb2824b',
      },
      meta_data: { keecash_user_id: 1 },
    };

    const res = await this.bridgecardService.registerCardholderAsync(body);

    if (res.status === HttpStatus.CREATED) {
      await this.userRepository.update(body.meta_data.keecash_user_id, {
        cardholderId: res.data.data.cardholder_id,
        status: UserStatus.Completed,
      });
    }
  }
}
