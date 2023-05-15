import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UserCompleteMessage, UserCreateMessage, UserService, UserStatus } from '@app/user';
import { TwilioService } from '@app/twilio';
import { BridgecardService } from '@app/bridgecard';
import { TransactionCreateMessage } from '@app/transaction';

@Injectable()
export class ConsumerService {
  private readonly logger = new Logger(ConsumerService.name);

  constructor(
    private readonly userService: UserService,
    private readonly twilioService: TwilioService,
    private readonly bridgecardService: BridgecardService,
  ) {}

  async handleUserCreate(message: UserCreateMessage): Promise<void> {
    await this.twilioService.sendEmailVerificationCode(message.user.email);
  }

  async handleUserComplete(message: UserCompleteMessage): Promise<void> {
    const {
      uuid,
      email,
      phoneNumber,
      country: { name },
      personProfile: { firstName, lastName, address1, address2, city, state, zipcode },
    } = await this.userService.findOneWithProfileAndDocuments(
      { uuid: message.user.uuid },
      true,
      false,
    );

    const body = {
      first_name: firstName,
      last_name: lastName,
      address: {
        address: address1,
        city,
        state: state,
        country: name,
        postal_code: zipcode,
        house_no: address2,
      },
      phone: phoneNumber,
      email_address: email,
      identity: {
        id_type: 'UNITED_STATES_DRIVERS_LICENSE', // user.documents[0].type
        id_no: '',
        id_image: '',
        bvn: '',
      },
      meta_data: {
        keecash_user_id: uuid,
      },
    };

    // const body = {
    //   first_name: 'HOL',
    //   last_name: 'MAYISSA BOUSSAMBA',
    //   address: {
    //     address: 'Libreville',
    //     city: 'Libreville',
    //     state: 'Estuaire',
    //     country: 'Gabon',
    //     postal_code: '24100',
    //     house_no: '01',
    //   },
    //   phone: '24166283620',
    //   email_address: 'buy@keecash.com',
    //   identity: {
    //     id_type: 'GABON_PASSPORT',
    //     id_no: '19GA17139',
    //     id_image:
    //       'https://firebasestorage.googleapis.com/v0/b/bridgecard-issuing.appspot.com/o/Screenshot%202023-02-16%20at%206.46.36%20PM.png?alt=media&token=d90d7c36-e761-4edf-9abc-c77791af846a',
    //     selfie_image:
    //       'https://firebasestorage.googleapis.com/v0/b/keecash-8b2cc.appspot.com/o/users%2FdZ5Ja2yRXcQBjHOnWU2HGXz0Lir1%2Fhol_selfie.jpg?alt=media&token=66426d57-91aa-4196-abde-a799cfb2824b',
    //   },
    //   meta_data: { keecash_user_id: 1 },
    // };

    const res = await this.bridgecardService.registerCardholderAsync(body);

    if (res.status === HttpStatus.CREATED) {
      await this.userService.update(body.meta_data.keecash_user_id, {
        cardholderId: res.data.data.cardholder_id,
        status: UserStatus.Completed,
      });
    }
  }

  async handleTransactionCreate(message: TransactionCreateMessage) {}
}
