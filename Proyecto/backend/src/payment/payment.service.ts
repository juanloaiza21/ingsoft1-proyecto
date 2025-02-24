import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PaypalGen } from './types/paypal-gen.types';

@Injectable()
export class PaymentService {
  private logger: Logger;
  private paypalToken: string;
  private purchaseId: string;
  private readonly paypalUrl: string;
  constructor(private readonly configService: ConfigService) {
    this.logger = new Logger('PaymentService');
    this.paypalToken = '';
    this.paypalUrl = this.configService.get('PAYPAL_API_URL');
  }

  async genBuy(value: string) {
    await this.generateAuth();
    const order = this.createOrder(value);
    const response = await this.makeRequest(order);

    return response.links[1].href;
  }

  private createOrder(value: string): Object {
    return {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: value,
          },
        },
      ],
      application_context: {
        brand_name: 'Owheels',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${this.configService.get('host')}/capture-order`,
        cancel_url: `${this.configService.get('host')}/cancel-payment`,
      },
    };
  }

  private async generateAuth(): Promise<void> {
    try {
      const reqUrl = `${this.paypalUrl}/v1/oauth2/token`;
      const clientId = this.configService.get('PAYPAL_CLIENT_ID');
      const clientSecret = this.configService.get('PAYPAL_CLIENT_SECRET');
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      const payload = await axios.post(reqUrl, params, {
        auth: {
          username: clientId,
          password: clientSecret,
        },
      });
      this.paypalToken = payload.data.access_token;
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        'Somenthing went wrong',
        HttpStatus.I_AM_A_TEAPOT,
      );
    }
  }

  private async makeRequest(data: Object): Promise<PaypalGen> {
    try {
      const reqUrl = `${this.paypalUrl}/v2/checkout/orders`;
      const payload = await axios.post(reqUrl, data, {
        headers: {
          Authorization: `Bearer ${this.paypalToken}`,
        },
      });
      return payload.data;
    } catch (e) {
      this.logger.error(e.message);
      throw new HttpException('Something went wrong', HttpStatus.I_AM_A_TEAPOT);
    }
  }
}
