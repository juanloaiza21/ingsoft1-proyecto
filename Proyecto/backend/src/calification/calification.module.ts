import { Module } from '@nestjs/common';
import { CalificationService } from './calification.service';
import { CalificationController } from './calification.controller';
import { PrismaModule } from 'src/core/prisma/prisma.module';

@Module({
  controllers: [CalificationController],
  providers: [CalificationService],
  imports: [PrismaModule],
})
export class CalificationModule {}
