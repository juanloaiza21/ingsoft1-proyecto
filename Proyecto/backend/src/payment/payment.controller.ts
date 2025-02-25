import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { GenerateBuyDTO } from './dto/genBuy.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paypalService: PaymentService) {}

  /**
   * @todo implement JWT for identification
   */
  @Post()
  async getAuth(@Body() payment: GenerateBuyDTO) {
    return await this.paypalService.genBuy(payment);
  }
}
