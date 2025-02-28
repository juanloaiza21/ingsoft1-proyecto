import { HttpException, Injectable, Logger } from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UserCreateTripDto } from './dto/user-create-trip.dto';
import { DriverCreateTripDto } from './dto/driver-create-trip.dto';
import { AcceptTripDto } from './dto/AcceptTrip.dto';

@Injectable()
export class TripService {
  logger: Logger;
  tripId: string;

  constructor(private readonly prismaService: PrismaService) {
    this.logger = new Logger(TripService.name);
  }

  private tripCodeGen(id: string) {
    const date = new Date();
    return `trip-${id}-${date.getTime()}`;
  }

  async create(createTripDto: CreateTripDto, id: string) {
    try {
      this.tripId = this.tripCodeGen(id);
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
      this.logger.error(error);
      throw new HttpException('Failed to create trip', 400);
    }
  }

  async findAll() {
    try {
      return await this.prismaService.trip.findMany();
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('Failed to create trip', 400);
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
      this.logger.error(error);
      throw new HttpException('Failed to create trip', 400);
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
      this.logger.error(error);
      throw new HttpException('Failed to create trip', 400);
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
      this.logger.error(error);
      throw new HttpException('Failed to create trip', 400);
    }
  }

  // Private CRUD operations for Passenger
  private async createPassenger(userId: string) {
    try {
      return await this.prismaService.passenger.create({
        data: {
          Trip: {
            connect: { id: this.tripId },
          },
          user: {
            connect: { id: userId },
          },
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to create passenger: ${error.message}`,
        error.stack,
      );
      this.logger.error(error);
      throw new HttpException('Failed to create trip', 400);
    }
  }

  public async findAllPassengersTrip(tripId: string) {
    try {
      return await this.prismaService.passenger.findMany({
        where: { tripId: tripId },
      });
    } catch (error) {
      this.logger.error(
        `Failed to find passengers: ${error.message}`,
        error.stack,
      );
      this.logger.error(error);
      throw new HttpException('Failed to create trip', 400);
    }
  }

  async userCreateTrip(data: UserCreateTripDto, userId: string) {
    try {
      await this.create(data, userId);
      await this.createPassenger(userId);
      return await this.findOne(this.tripId);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('Failed to create trip', 400);
    }
  }

  async driverCreateTrip(data: DriverCreateTripDto, id: string) {
    try {
      this.tripId = this.tripCodeGen(id);
      return await this.prismaService.trip.create({
        data: {
          origin: data.origin,
          destination: data.destination,
          departureDate: new Date(data.date),
          beginDate: new Date(data.date),
          endDate: new Date(data.date),
          status: 'PENDING',
          price: data.price,
          id: this.tripId,
          driver: {
            connect: { id },
          },
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('Failed to create trip', 400);
    }
  }

  async driverAcceptTrip(tripId: AcceptTripDto, driverId: string) {
    try {
      return await this.prismaService.trip.update({
        where: { id: tripId.tripId },
        data: { driver: { connect: { id: driverId } } },
      });
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('Failed to create trip', 400);
    }
  }

  async userJoinTrip(tripId: AcceptTripDto, userId: string) {
    try {
      this.tripId = tripId.tripId;
      return await this.createPassenger(userId);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('Failed to create trip', 400);
    }
  }
}
