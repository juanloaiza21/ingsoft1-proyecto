import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/core/prisma/prisma.module';

@Module({
  providers: [PaymentService],
  controllers: [PaymentController],
  imports: [ConfigModule, PrismaModule],
})
export class PaymentModule {}
