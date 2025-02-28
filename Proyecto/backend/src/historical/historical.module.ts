import { Module } from '@nestjs/common';
import { HistoricalService } from './historical.service';
import { HistoricalController } from './historical.controller';
import { PrismaModule } from 'src/core/prisma/prisma.module';

@Module({
  controllers: [HistoricalController],
  providers: [HistoricalService],
  imports: [PrismaModule],
})
export class HistoricalModule {}
