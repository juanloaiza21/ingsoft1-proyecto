import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { GenerateBuyDTO } from './dto/genBuy.dto';
import { CreatePrefOptions } from './types/create-pref.type';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('methods')
  async getPaymentMethods() {
    return await this.paymentService.getPaymentMethods();
  }

  @Post('checkout')
  async createTripBillPreference(@Body() query: GenerateBuyDTO) {
    const data: CreatePrefOptions = {
      productName: 'OwheelsTravel',
      productDescription: 'Trip',
      productId: query.tripId,
      productPrice: query.value,
      userEmail: query.email,
      transactionId: query.tripId,
    };
    return await this.paymentService.createTripBillPreference(data);
  }
}
