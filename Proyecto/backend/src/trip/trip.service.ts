import { Injectable, Logger } from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class TripService {
  logger: Logger;
  tripId: string;

  constructor(private readonly prismaService: PrismaService) {
    this.logger = new Logger(TripService.name);
  }

  private tripCodeGen(userEmail: string) {
    const date = new Date();
    return `trip-${userEmail}-${date.getTime()}`;
  }

  async create(createTripDto: CreateTripDto, email: string) {
    try {
      this.tripId = this.tripCodeGen(email);
      return await this.prismaService.trip.create({
        data: {
          origin: createTripDto.origin,
          destination: createTripDto.destination,
          departureDate: new Date(createTripDto.date),
          beginDate: new Date(createTripDto.date),
          endDate: new Date(createTripDto.date),
          status: 'PENDING',
          price: createTripDto.price,
          id: this.tripId,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to create trip: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.prismaService.trip.findMany();
    } catch (error) {
      this.logger.error(`Failed to find trips: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      return await this.prismaService.trip.findUnique({
        where: { id },
      });
    } catch (error) {
      this.logger.error(
        `Failed to find trip ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(id: string, updateTripDto: UpdateTripDto) {
    try {
      return await this.prismaService.trip.update({
        where: { id },
        data: updateTripDto,
      });
    } catch (error) {
      this.logger.error(
        `Failed to update trip ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prismaService.trip.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(
        `Failed to remove trip ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async userCreateTrip() {}

  async driverCreateTrip() {}

  async driverAcceptTrip() {}
}
