import { HttpException, Injectable, Logger } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class DriverService {
  logger: Logger;

  constructor(private readonly prismaService: PrismaService) {
    this.logger = new Logger(DriverService.name);
  }

  async create(createDriverDto: CreateDriverDto, userId: string) {
    try {
      return await this.prismaService.driver.create({
        data: {
          runtNumber: createDriverDto.runtNumber,
          licenseExpirationDate: new Date(
            createDriverDto.licenseExpirationDate,
          ),
          User: {
            connect: {
              id: userId,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error('Error creating driver', error);
      throw new HttpException('Error creating driver', 420);
    }
  }

  async findAll() {
    try {
      return await this.prismaService.driver.findMany();
    } catch (error) {
      this.logger.error('Error finding all drivers', error);
      throw new HttpException('Error finding all drivers', 404);
    }
  }

  async findOne(id: string) {
    try {
      return await this.prismaService.driver.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      this.logger.error('Error finding all drivers', error);
      throw new HttpException('Error finding all drivers', 404);
    }
  }

  async update(id: string, updateDriverDto: UpdateDriverDto) {
    try {
      const data = await this.prismaService.driver.findUnique({
        where: {
          id,
        },
      });
      if (!data.id) throw new HttpException('Driver not found', 404);
      return data;
    } catch (error) {
      this.logger.error('Error updating driver', error);
      throw new HttpException('Error updating driver', 420);
    }
  }

  async findTrips(userId: string, userId2: string) {
    try {
      const gains: number[] = [];
      if (userId !== userId2) {
        throw new HttpException('Unauthorized', 401);
      }
      const data = await this.prismaService.trip.findMany({
        where: {
          driverId: userId,
        },
      });
      data.forEach((trip) => {
        trip.price = trip.price - trip.price * 0.1;
        gains.push(trip.price);
      });
      const averageGains =
        gains.length > 0
          ? gains.reduce((sum, gain) => sum + gain, 0) / gains.length
          : 0;
      return { trips: data, gains, averageGains };
    } catch (error) {
      this.logger.error('Error finding trips', error);
      throw new HttpException('Error finding trips', 404);
    }
  }
}
