import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaymentMethod } from './enum/payment.enum';
import { GenerateBuyDTO } from './dto/genBuy.dto';
import {
  MercadoPagoConfig,
  Payment,
  Customer,
  CustomerCard,
} from 'mercadopago';
import axios from 'axios';
import { PaymentCreateData } from 'mercadopago/dist/clients/payment/create/types';
import { CustomerCardCreateData } from 'mercadopago/dist/clients/customerCard/create/types';

@Injectable()
export class PaymentService {
  private logger: Logger;
  private readonly mercadopagoConfig: MercadoPagoConfig;
  private readonly mercadopago: Payment;
  private readonly customer: Customer;
  private readonly customerCard: CustomerCard;

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    this.logger = new Logger('PaymentService');
    this.mercadopagoConfig = new MercadoPagoConfig({
      accessToken: this.configService.get<string>('MERCADOPAGO_ACCESS_TOKEN'),
      options: { timeout: 5000, idempotencyKey: 'abc' },
    });
    this.mercadopago = new Payment(this.mercadopagoConfig);
    this.customer = new Customer(this.mercadopagoConfig);
    this.customerCard = new CustomerCard(this.mercadopagoConfig);
  }

  async generateBuy(generateBuyDTO: GenerateBuyDTO) {
    const { id, method, tripId, value, email } = generateBuyDTO;
    try {
      const body = this.generatePaymentBody(
        value,
        'Trip payment',
        method,
        email,
      );
      this.logger.log(body);
      await this.mercadopago
        .create(body)
        .then((r) => this.logger.log(r))
        .catch((e) => this.logger.error(e));
      return 'jiji';
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('Error generating buy', 400);
    }
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

  private generatePaymentBody(
    transaction_amount: number,
    description: string,
    payment_method_id: string,
    email: string,
  ): PaymentCreateData {
    return {
      body: {
        transaction_amount,
        description,
        payment_method_id,
        payer: {
          email,
        },
      },
      requestOptions: {},
    };
  }

  async createCustomer(id: string) {
    try {
      const userData = await this.prismaService.user.findUnique({
        where: { id },
      });
      if (!userData)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      const data = await this.customer.create({
        body: {
          email: userData.email,
          first_name: userData.name,
          phone: { area_code: '57', number: userData.phoneNumber },
          identification: {
            type: 'CC',
            number: userData.id,
          },
        },
      });
      return { mpId: data.id };
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException('Error creating customer', 400);
    }
  }

  async createCard(customerId: string, cardToken: string) {
    try {
      const body: CustomerCardCreateData = {
        customerId,
        body: {
          token: cardToken,
        },
      };
      await this.customerCard.create(body);
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException('Error creating card', 400);
    }
  }
}
