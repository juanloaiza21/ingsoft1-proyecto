import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import { PaypalGen } from './types/paypal-gen.types';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaymentMethod } from './enum/payment.enum';
import { GenerateBuyDTO } from './dto/genBuy.dto';

@Injectable()
export class PaymentService {
  private logger: Logger;
  private paypalToken: string;
  private readonly paypalUrl: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    this.logger = new Logger('PaymentService');
    this.paypalToken = '';
    this.paypalUrl = this.configService.get('PAYPAL_API_URL');
  }

  /**
   * @todo implement payment method cash
   */
  async genBuy(payment: GenerateBuyDTO): Promise<string> {
    try {
      const { id, method, tripId, value } = payment;
      if (method === PaymentMethod.CASH) return 'Cash payment';
      await this.generateAuth();
      const order = this.createOrder(value.toString());
      const response = await this.makeRequest(order);
      this.logger.log('Se hace la peticion');
      await this.savePayment(response.id, method, +value, tripId);
      this.logger.log('Se guarda el codigo');
      return response.links[1].href;
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException('Something went wrong', HttpStatus.I_AM_A_TEAPOT);
    }
  }

  private async savePayment(
    id: string,
    method: PaymentMethod,
    amount: number,
    tripId: string,
  ) {
    try {
      await this.prismaService.bill.create({
        data: {
          id,
          amount,
          paymenForm: method,
          Trip: {
            connect: {
              id: tripId,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException('Something went wrong', HttpStatus.I_AM_A_TEAPOT);
    }
  }

  /**
   * @todo implement redirection routes
   */
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
