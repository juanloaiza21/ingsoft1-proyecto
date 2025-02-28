import { Module } from '@nestjs/common';
import { HistoricalService } from './historical.service';
import { HistoricalController } from './historical.controller';

@Module({
  controllers: [HistoricalController],
  providers: [HistoricalService],
})
export class HistoricalModule {}
