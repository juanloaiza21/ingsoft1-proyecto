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

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({ load: [configuration] }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
})
export class AppModule {}
