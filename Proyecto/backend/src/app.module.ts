import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './core/prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './core/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './core/config/configuration';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './core/response/response.interceptor';
import { PaymentModule } from './payment/payment.module';
import { DriverModule } from './driver/driver.module';
import { TripModule } from './trip/trip.module';
import { HistoricalModule } from './historical/historical.module';
import { CalificationModule } from './calification/calification.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({ load: [configuration] }),
    PaymentModule,
    DriverModule,
    TripModule,
    HistoricalModule,
    CalificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
})
export class AppModule {}
