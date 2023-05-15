import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import * as bcrypt from 'bcrypt';
import * as isoCountries from 'i18n-iso-countries';
import { Country, CountryService } from '@app/country';
import { DocumentService } from '@app/document';
import { EnterpriseProfileService } from '@app/enterprise-profile';
import { PersonProfileService } from '@app/person-profile';
import { ShareholderService } from '@app/shareholder';
import { TwilioService } from '@app/twilio';
import { BridgecardService } from '@app/bridgecard';
import { SumsubService } from '@app/sumsub';
import {
  User,
  AccountType,
  Language,
  UserStatus,
  VerificationStatus,
  UserCreateMessage,
  UserEventPattern,
} from '@app/user';
import { ClosureReasonService } from '@app/closure-reason';
import { OutboxService } from '@app/outbox';
import { TransactionService } from '@api/transaction/transaction.service';
import { CardService } from '@api/card/card.service';
import { CreateUserDto } from '@api/auth/dto/create-user.dto';
import { UserRepository } from './user.repository';
import { UserCompleteMessage } from '@app/user/messages/user-complete.message';

const closure_reasons = require('../../../../libs/closure-reason/src/closure-reasons.json');

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
    private readonly twilioService: TwilioService,
    private readonly closureReasonService: ClosureReasonService,
    private readonly transactionService: TransactionService,
    private readonly bridgecardService: BridgecardService,
    private readonly sumsubService: SumsubService,
    private readonly cardService: CardService,
    private readonly outboxService: OutboxService,
  ) {
    this.generateReferralId = customAlphabet(REFERRAL_ID_ALPHABET, REFERRAL_ID_LENGTH);
  }

  async findOne(param: any): Promise<User> {
    return this.userRepository.findOne({ where: param });
  }

  async findByUuid(uuid: string): Promise<User> {
    return this.userRepository.findOne({ where: { uuid } });
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

    // if (withProfile && !user.personProfile) {
    //   throw new NotFoundException('Cannot find profile data for this user');
    // }

    // if (withDocuments && !user.documents.length) {
    //   throw new NotFoundException('Cannot find any documents for this user');
    // }

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
    let referralId;
    let referralIdDuplicated = true;

    while (referralIdDuplicated) {
      referralId = this.generateReferralId();
      const userExists = await this.userRepository.findOne({ where: { referralId } });
      if (!userExists) referralIdDuplicated = false;
    }

    const queryRunner = this.userRepository.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const user = await queryRunner.manager.save(
        this.userRepository.create({
          ...body,
          password: await bcrypt.hash(body.password, 10),
          referralId,
        }),
      );
      const savedUser = await queryRunner.manager.findOneBy(User, { uuid: user.uuid });

      const payload = new UserCreateMessage({
        user: savedUser,
      });

      await this.outboxService.create(queryRunner, UserEventPattern.UserCreate, payload);
      await queryRunner.commitTransaction();

      return this.findByUuid(user.uuid);
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async update(param: any, data: Partial<User>) {
    return this.userRepository.update(param, data);
  }

  async resetPassword(userId: number, password: string): Promise<boolean> {
    await this.userRepository.update({ id: userId }, { password: await bcrypt.hash(password, 10) });

    return true;
  }

  async setPincode(userId: number, pincode: string): Promise<void> {
    const encryptedPincode = await bcrypt.hash(pincode, 10);

    await this.userRepository.update(
      { id: userId },
      { pincode: encryptedPincode, pincodeSet: true },
    );
  }

  async getAccountSettings(userUuid: string): Promise<any> {
    const userWithProfile = await this.findOneWithProfileAndDocuments(
      { uuid: userUuid },
      true,
      false,
    );

    const { countryCode } = await this.countryService.findOne({ id: userWithProfile.countryId });

    const defaultReasons = closure_reasons;

    if (userWithProfile.status === UserStatus.Closed) {
      const reasonIds = await this.closureReasonService.findByUserId(userWithProfile.id);

      reasonIds.map((reasonId) => {
        defaultReasons[reasonId - 1].is_checked = true;
      });
    }

    const keecash_wallets = await this.transactionService.getBalanceArrayByCurrency(
      userWithProfile.id,
    );

    // Get cards
    const bridgecards = await this.bridgecardService.getAllCardholderCards(
      userWithProfile.cardholderId,
    );
    const details = await Promise.all(
      bridgecards.map(async (card) => {
        const balancePromise = this.bridgecardService.getCardBalance(card.card_id);
        const transactionsPromise = this.bridgecardService.getCardTransactions(card.card_id);
        const keecashCardPromise = this.cardService.findOne({ bridgecardId: card.card_id });

        const [balance, transactions, keecashCard] = await Promise.all([
          balancePromise,
          transactionsPromise,
          keecashCardPromise,
        ]);

        return {
          balance,
          isBlockByAdmin: keecashCard.isBlocked,
          lastTransaction: transactions.transactions && {
            amount: transactions.transactions[0].amount,
            date: transactions.transactions[0].transaction_date, //2022-08-08 02:48:15
            image: '',
            to: transactions.transactions[0].description,
            type: '',
            currency: transactions.transactions[0].currency,
            from: '',
          },
        };
      }),
    );
    const cards = bridgecards.map((card, i) => ({
      cardId: card.card_id,
      balance: details[i].balance,
      currency: card.card_currency,
      isBlock: !card.is_active,
      isBlockByAdmin: details[i].isBlockByAdmin,
      isExpired: new Date(`${card.expiry_year}-${card.expiry_month}-01`) < new Date(),
      cardNumber: card.card_number,
      name: card.meta_data.keecash_card_name,
      date: `${card.expiry_month}/${card.expiry_year.slice(-2)}`,
      cardholderName: card.card_name,
      lastTransaction: details[i].lastTransaction,
    }));

    // Format user setting
    const userSetting = {
      firstname: userWithProfile.personProfile.firstName,
      lastname: userWithProfile.personProfile.lastName,
      url_avatar: userWithProfile.urlAvatar,
      email: userWithProfile.email,
      country_code: countryCode,
      phone_number: userWithProfile.phoneNumber,
      account_level: userWithProfile.type,
      list_lang: [
        { lang: 'fr', is_checked: userWithProfile.language === Language.French },
        { lang: 'en', is_checked: userWithProfile.language === Language.English },
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
    const res = await this.twilioService.confirmEmailVerificationCode(newEmail, otp);

    if (!res) {
      throw new BadRequestException('Cannot confirm email verification code');
    }

    await this.userRepository.update(userId, { email: newEmail });
  }

  async completeAccount(userUuid: string) {
    const {
      fixedInfo: { firstName, lastName },
      info: { country, addresses },
    } = await this.sumsubService.getApplicantData(userUuid);

    // Get country full name from 3-character code
    const countryName = isoCountries.getName(country, 'en', { select: 'alias' });

    // TODO: Investigate more about address array of sumsub response data
    const { state, town, street, subStreet, postCode } = addresses[0] || {};

    const queryRunner = this.userRepository.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const { id: userId } = await queryRunner.manager.findOneBy(User, { uuid: userUuid });
      const { id: countryId } = await queryRunner.manager.findOneBy(Country, { name: countryName });
      await queryRunner.manager.save(
        await this.personProfileService.create({
          userId,
          firstName,
          lastName,
          state,
          city: town,
          zipcode: postCode,
          address1: street,
          address2: subStreet,
        }),
      );
      await queryRunner.manager.update(User, userId, {
        countryId,
        kycStatus: VerificationStatus.Validated,
        status: UserStatus.Completed,
      });
      const updatedUser = await queryRunner.manager.findOneBy(User, { uuid: userUuid });

      const payload = new UserCompleteMessage({
        user: updatedUser,
      });

      await this.outboxService.create(queryRunner, UserEventPattern.UserComplete, payload);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async handleSumsubWebhookEvent({ applicantId, type, reviewResult }) {
    switch (type) {
      case 'applicantReviewed':
        if (reviewResult.reviewAnswer === 'GREEN') {
          await this.completeAccount(applicantId);
        } else {
          await this.userRepository.update(
            { uuid: applicantId },
            { kycStatus: VerificationStatus.Rejected },
          );
        }
        break;

      default:
        break;
    }
  }
}
