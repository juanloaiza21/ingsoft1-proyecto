import { Controller, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { get } from 'http';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paypalService: PaymentService) {}

  @Get()
  async getAuth() {
    return await this.paypalService.genBuy('1');
  }
}
