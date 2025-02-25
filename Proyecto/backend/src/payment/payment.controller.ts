import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { GenerateBuyDTO } from './dto/genBuy.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paypalService: PaymentService) {}
}
