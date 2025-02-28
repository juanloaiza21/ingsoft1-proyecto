import { HttpException, Injectable, Logger } from '@nestjs/common';
import { CreateHistoricalDto } from './dto/create-historical.dto';
import { UpdateHistoricalDto } from './dto/update-historical.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class HistoricalService {
  logger: Logger;

  constructor(private readonly prismaService: PrismaService) {
    this.logger = new Logger(HistoricalService.name);
  }

  async findAllTripsUser(userId: string) {
    try {
      const trips = [];
      const data = await this.prismaService.passenger.findMany({
        where: { userId: userId },
      });
      data.forEach((element) => {
        trips.push(element.tripId);
      });
      return await this.prismaService.trip.findMany({
        where: { id: { in: trips } },
      });
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('Failed to create trip  ', 400);
    }
  }

  async findAllBills(userId: string) {
    try {
      return await this.prismaService.bill.findMany({
        where: { id: userId },
      });
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('Failed to create trip  ', 400);
    }
  }
}
