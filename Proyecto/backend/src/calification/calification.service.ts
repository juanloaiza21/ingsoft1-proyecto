import { HttpException, Injectable, Logger } from '@nestjs/common';
import { CreateCalificationDto } from './dto/create-calification.dto';
import { UpdateCalificationDto } from './dto/update-calification.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class CalificationService {
  logger: Logger;

  constructor(private readonly prismaService: PrismaService) {
    this.logger = new Logger(CalificationService.name);
  }

  async create(createCalificationDto: CreateCalificationDto) {
    try {
      await this.prismaService.calification.create({
        data: {
          score: createCalificationDto.score,
          comment: createCalificationDto.comment,
          User: {
            connect: {
              id: createCalificationDto.userCalificatedId.toString(),
            },
          },
        },
      });
      return;
    } catch (error) {
      this.logger.error('Error creating calification', error);
      throw new HttpException('Error creating calification', 420);
    }
  }

  async findAll(userId: string) {
    try {
      const data = await this.prismaService.calification.findMany({
        where: { userId: userId },
      });
      return data;
    } catch (error) {
      this.logger.error('Error finding all califications', error);
      throw new HttpException('Error creating calification', 420);
    }
  }

  async getCalificationsByUserId(userId: string) {
    try {
      const result: number[] = [];
      const data = await this.prismaService.calification.findMany({
        where: { userId: userId },
      });
      data.forEach((calification) => {
        result.push(calification.score);
      });
      return this.promGen(result);
    } catch (error) {
      this.logger.error('Error finding all califications', error);
      throw new HttpException('Error creating calification', 420);
    }
  }

  private promGen(data: number[]): number {
    if (data.length === 0) {
      return 0;
    }

    const sum = data.reduce((acc, current) => acc + current, 0);
    return sum / data.length;
  }

  async update(id: number, updateCalificationDto: UpdateCalificationDto) {
    try {
      return `This action updates a #${id} calification`;
    } catch (error) {
      this.logger.error(`Error updating calification with id ${id}`, error);
      throw new HttpException('Error creating calification', 420);
    }
  }

  async remove(id: number) {
    try {
      return `This action removes a #${id} calification`;
    } catch (error) {
      this.logger.error(`Error removing calification with id ${id}`, error);
      throw new HttpException('Error creating calification', 420);
    }
  }
}
