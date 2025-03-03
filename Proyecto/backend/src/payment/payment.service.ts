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
import { connect } from 'http2';
import { BillStatus } from '@prisma/client';

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

  private generatePreferenceBody(options: CreatePrefOptions) {
    options.transactionId =
      options.transactionId + new Date().getTime() + options.userEmail;
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
          success: this.configService.get('host') + '/payment/result-payment',
          failure: this.configService.get('host') + '/payment/result-payment',
          pending: this.configService.get('host') + '/payment/result-payment',
        },
        payer: {
          email: options.userEmail,
        },
        external_reference: options.transactionId,
      },
    };
  }

  async createTripBillPreference(options: CreatePrefOptions, id: string) {
    try {
      const data = this.generatePreferenceBody(options);
      const { body } = data;
      const result = await this.pref.create({ body });
      await this.prismaService.trip.update({
        where: {
          id: options.productId,
        },
        data: {
          price: options.productPrice,
        },
      });
      await this.createBill(
        options.productId,
        id,
        options.productPrice,
        body.external_reference,
      );
      this.logger.log(result);
      return {
        paylink: result.init_point,
        billId: result.id,
        externalId: result.external_reference,
      };
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        'Error creating preference',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getPrefByOrderId(id: string) {
    try {
      const result = await this.pref.get({
        preferenceId: id,
      });
      return {
        paylink: result.init_point,
        billId: result.id,
        externalId: result.external_reference,
        collectorId: result.collector_id,
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('Error getting payment', 400);
    }
  }

  private async createBill(
    tripId: string,
    userId: string,
    amount: number,
    paymentId: string,
  ) {
    try {
      await this.prismaService.bill.create({
        data: {
          amount,
          Trip: {
            connect: { id: tripId },
          },
          User: {
            connect: { id: userId },
          },
          paymenForm: 'MERCADOPAGO',
          paymentId,
          status: 'PENDING',
          id: tripId + '-bill-' + userId,
        },
      });
      return true;
    } catch (error) {
      this.logger.error(`Failed to create bill: ${error.message}`);
      throw new HttpException(
        'Error creating bill',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPaymentById(id: string) {
    try {
      const data = await this.payment.get({ id });
      const status: BillStatus =
        data.status === 'approved' ? BillStatus.ACCEPTED : BillStatus.CANCELLED;
      if (status != BillStatus.ACCEPTED)
        throw new HttpException(
          'Payment not approved',
          HttpStatus.PAYMENT_REQUIRED,
        );
      await this.prismaService.bill.update({
        where: {
          paymentId: data.external_reference,
        },
        data: {
          status: status,
        },
      });
      return data.status;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('Somenthing went wrong', 400);
    }
  }

  async getBill(id: string) {
    try {
      return await this.prismaService.bill.findUnique({
        where: {
          paymentId: id,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('Error finding bill', 400);
    }
  }
}
