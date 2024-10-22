import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { CreateBridgecardDto } from './dto/create-bridgecard.dto';
import { FundBridgecardDto } from './dto/fund-bridgecard.dto';
import { UnloadBridgecardDto } from './dto/unload-bridgecard.dto';

@Injectable()
export class BridgecardService {
  private readonly logger = new Logger(BridgecardService.name);
  private axiosInstance: AxiosInstance;
  private axiosInstanceDecrypted: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.axiosInstance = axios.create({
      baseURL: this.configService.get('bridgecardConfig.baseUrl'),
      headers: {
        token: `Bearer ${this.configService.get('bridgecardConfig.authToken')}`,
      },
    });

    this.axiosInstanceDecrypted = axios.create({
      baseURL: this.configService.get('bridgecardConfig.baseUrlDecrypted'),
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

  async createCard(data: CreateBridgecardDto): Promise<string> {
    const body = {
      cardholder_id: data.cardholderId,
      card_type: data.type,
      card_brand: data.brand,
      card_currency: data.currency,
      meta_data: {
        keecash_user_id: data.userId,
        keecash_card_uuid: data.cardUuid,
        keecash_card_name: data.cardName,
      },
    };

    const res = await this.axiosInstance.post('/cards/create_card', body);

    this.logger.log(res.data.message);

    return res.data.data.card_id;
  }

  async getCardBalance(cardId: string) {
    try {
      const res = await this.axiosInstanceDecrypted.get(`/cards/get_card_balance`, {
        params: {
          card_id: cardId,
        },
      });

      return res.data.data.balance;
    } catch (error) {
      const { status, statusText, data } = error.response || {};

      throw new HttpException(data?.message || statusText, status);
    }
  }

  async getCardDetails(cardId: string) {
    try {
      const res = await this.axiosInstanceDecrypted.get(`/cards/get_card_details`, {
        params: {
          card_id: cardId,
        },
      });

      return res.data.data;
    } catch (error) {
      const { status, statusText, data } = error.response || {};

      throw new HttpException(data?.message || statusText, status);
    }
  }

  async getAllCardholderCards(cardholderId: string) {
    try {
      const res = await this.axiosInstanceDecrypted.get(`/cards/get_all_cardholder_cards`, {
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

  async getCardTransactions(cardId: string) {
    try {
      const res = await this.axiosInstanceDecrypted.get(`/cards/get_card_transactions`, {
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

  async freezeCard(cardId: string): Promise<any> {
    return this.axiosInstance.patch(`/cards/freeze_card?card_id=${cardId}`);
  }

  async unfreezeCard(cardId: string) {
    await this.axiosInstance.patch(`/cards/unfreeze_card?card_id=${cardId}`);
  }

  async fundCard(data: FundBridgecardDto): Promise<any> {
    try {
      const res = await this.axiosInstance.post('/cards/fund_card', data);

      this.logger.log(res.data.message);

      return res.data.data;
    } catch (error) {
      const { status, statusText, data } = error.response || {};

      throw new HttpException(data.message || statusText, status);
    }
  }

  async unloadCard(data: UnloadBridgecardDto): Promise<any> {
    try {
      const res = await this.axiosInstance.post('/cards/unload_card', data);

      this.logger.log(res.data.message);

      return res.data.data;
    } catch (error) {
      const { status, statusText, data } = error.response || {};

      throw new HttpException(data.message || statusText, status);
    }
  }
}
