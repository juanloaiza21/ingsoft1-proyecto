import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { GenerateBuyDTO } from './dto/genBuy.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('methods')
  async getPaymentMethods() {
    return await this.paymentService.getPaymentMethods();
  }

  @Post('pay')
  async generateBuy(@Body() generateBuyDTO: GenerateBuyDTO) {
    return await this.paymentService.generateBuy(generateBuyDTO);
  }

  @Post('create-user')
  async callback(@Body() { id }: { id: string }) {
    return await this.paymentService.createCustomer(id);
  }
}
