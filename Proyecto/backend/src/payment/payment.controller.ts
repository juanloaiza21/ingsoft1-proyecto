import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { GenerateBuyDTO } from './dto/genBuy.dto';
import { CreatePrefOptions } from './types/create-pref.type';
import { JwtAuthGuard } from 'src/core/auth/guard/jwt-auth.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('methods')
  async getPaymentMethods() {
    return await this.paymentService.getPaymentMethods();
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('checkout')
  async createTripBillPreference(
    @Body() query: GenerateBuyDTO,
    @Request() req,
  ) {
    const data: CreatePrefOptions = {
      productName: 'OwheelsTravel',
      productDescription: 'Trip',
      productId: query.tripId,
      productPrice: query.value,
      userEmail: query.email,
      transactionId: query.tripId,
    };
    return await this.paymentService.createTripBillPreference(
      data,
      req.user.userId,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get('result-pref/:id')
  async getPrefById(@Param('id') id: string) {
    return await this.paymentService.getPrefByOrderId(id);
  }

  @HttpCode(HttpStatus.OK)
  @Get('result-payment/')
  async getPaymentById(@Query('collection_id') id: string) {
    return await this.paymentService.getPaymentById(id);
  }
}
