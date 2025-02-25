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
  }
}
