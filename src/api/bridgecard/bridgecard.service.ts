import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { CreateBridgecardDto } from './dto/create-bridgecard.dto';

@Injectable()
export class BridgecardService {
  private readonly logger = new Logger(BridgecardService.name);
  private axiosInstance: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.axiosInstance = axios.create({
      baseURL: this.configService.get('bridgecardConfig.baseUrl'),
      headers: {
        token: `Bearer ${this.configService.get('bridgecardConfig.authToken')}`,
      },
    });
  }

  // --------------- Cardholder Management -------------------

  async registerCardholderSync(body: any) {
    const res = await this.axiosInstance.post(
      '/cardholder/register_cardholder_synchronously',
      body,
    );
  }

  async registerCardholderAsync(body: any): Promise<any> {
    try {
      const res = await this.axiosInstance.post('/cardholder/register_cardholder', body);

      this.logger.debug(
        `Cardholder created successfully for userId: ${body.meta_data.keecash_user_id} | CardholderId: ${res.data.data.cardholder_id}`,
      );

      return res;
    } catch (error) {
      const { status, statusText, data } = error.response || {};

      throw new HttpException(data.message || statusText, status);
    }
  }

  async getCardholderDetails(cardholderId: string) {
    try {
      const res = await this.axiosInstance.get(`/cardholder/get_cardholder`, {
        params: {
          cardholder_id: cardholderId,
        },
      });

      return res.data.data;
    } catch (error) {
      const { status, statusText, data } = error.response || {};

      throw new HttpException(data.message || statusText, status);
    }
  }

  async deleteCardholder(cardholderId: string): Promise<any> {
    try {
      await this.axiosInstance.delete(`/cardholder/delete_cardholder/${cardholderId}`);

      return true;
    } catch (error) {
      const { status, statusText, data } = error.response || {};

      throw new HttpException(data.message || statusText, status);
    }
  }

  // ------------------ Card Management ----------------------

  async createCard(data: CreateBridgecardDto) {
    try {
      const body = {
        cardholder_id: data.cardholderId,
        card_type: data.type,
        card_brand: data.brand,
        card_currency: data.currency,
        meta_data: {
          keecash_user_id: data.userId,
          keecash_card_name: data.cardName,
        },
      };

      const res = await this.axiosInstance.post('/cards/create_card', body);

      this.logger.log(res.data.message);
    } catch (error) {
      const { status, statusText, data } = error.response || {};

      throw new HttpException(data.message || statusText, status);
    }
  }

  async setCardSecurePin() {
    const body = {
      card_id: '8389303030030c460e9250',
      card_pin: 'encrypted pin',
    };

    const res = await this.axiosInstance.post('/cards/set_3d_secure_pin', body);

    if (res.status === HttpStatus.OK) {
      this.logger.log(res.data.message);
    } else {
      this.logger.error(res.data.message);
    }
  }

  async getCardDetails(cardId: string) {
    try {
      const res = await this.axiosInstance.get(`/cardholder/get_card_details`, {
        params: {
          card_id: cardId,
        },
      });

      return res.data.data;
    } catch (error) {
      const { status, statusText, data } = error.response || {};

      throw new HttpException(data.message || statusText, status);
    }
  }

  async getAllCardholderCards(cardholderId: string) {
    try {
      const res = await this.axiosInstance.get(`/cardholder/get_all_cardholder_cards`, {
        params: {
          cardholder_id: cardholderId,
        },
      });

      return res.data.data.cards;
    } catch (error) {
      const { status, statusText, data } = error.response || {};

      throw new HttpException(data.message || statusText, status);
    }
  }

  async freezeCard(cardId: string) {
    try {
      await this.axiosInstance.patch('/cards/freeze_card', {
        params: {
          card_id: cardId,
        },
      });
    } catch (error) {
      const { status, statusText, data } = error.response || {};

      throw new HttpException(data.message || statusText, status);
    }
  }

  async unfreezeCard(cardId: string) {
    try {
      await this.axiosInstance.patch('/cards/unfreeze_card', {
        params: {
          card_id: cardId,
        },
      });
    } catch (error) {
      const { status, statusText, data } = error.response || {};

      throw new HttpException(data.message || statusText, status);
    }
  }
}
