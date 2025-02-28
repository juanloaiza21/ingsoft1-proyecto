import { Module } from '@nestjs/common';
import { CalificationService } from './calification.service';
import { CalificationController } from './calification.controller';

@Module({
  controllers: [CalificationController],
  providers: [CalificationService],
})
export class CalificationModule {}
