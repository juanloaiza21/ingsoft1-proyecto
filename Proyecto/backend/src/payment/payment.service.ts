import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { GenerateBuyDTO } from './dto/genBuy.dto';
import { CreatePrefOptions } from './types/create-pref.type';
import {
  MercadoPagoConfig,
  Payment,
  Preference,
  MerchantOrder,
} from 'mercadopago';
import axios from 'axios';

@Injectable()
export class PaymentService {
  private logger: Logger;
  private readonly mercadopagoConfig: MercadoPagoConfig;
  private readonly payment: Payment;
  private readonly pref: Preference;
  private readonly merchantOrder: MerchantOrder;

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    this.logger = new Logger('PaymentService');
    this.mercadopagoConfig = new MercadoPagoConfig({
      accessToken: this.configService.get<string>('MERCADOPAGO_ACCESS_TOKEN'),
      options: { timeout: 5000, idempotencyKey: 'abc' },
    });
    this.payment = new Payment(this.mercadopagoConfig);
    this.pref = new Preference(this.mercadopagoConfig);
    this.merchantOrder = new MerchantOrder(this.mercadopagoConfig);
  }

  async getPaymentMethods() {
    try {
      const result: { id: string; name: string; paymentType: string }[] = [];
      const paymentMethods = await axios.get(
        'https://api.mercadopago.com/v1/payment_methods',
        {
          headers: {
            Authorization: `Bearer ${this.configService.get<string>('MERCADOPAGO_ACCESS_TOKEN')}`,
          },
        },
      );
      const data = paymentMethods.data;
      data.forEach((element) => {
        result.push({
          id: element.id,
          name: element.name,
          paymentType: element.payment_type_id,
        });
      });
      return result;
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException('Error getting payment methods', 400);
    }
  }

  generatePreferenceBody(options: CreatePrefOptions) {
    return {
      body: {
        items: [
          {
            id: options.productId,
            title: options.productName,
            description: options.productDescription,
            quantity: 1,
            currency_id: 'COP',
            unit_price: options.productPrice,
          },
        ],
        back_urls: {
          success: this.configService.get('host') + '/success',
          failure: this.configService.get('host') + '/fail',
          pending: this.configService.get('host') + '/pending',
        },
        payer: {
          email: options.userEmail,
        },
        external_reference: options.transactionId,
      },
    };
  }

  async createTripBillPreference(options: CreatePrefOptions) {
    try {
      const data = this.generatePreferenceBody(options);
      const { body } = data;
      return (await this.pref.create({ body })).init_point;
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        'Error creating preference',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getPaymentById(id: string) {
    return this.payment.get({ id });
  }

  async getPrefByOrderId(id: number) {
    const result = await this.merchantOrder.get({ merchantOrderId: id });
    return this.pref.get({ preferenceId: result.preference_id });
  }

  async createBill() {}

  async confirmPurchase() {}
}
