import { HttpException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../core/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * @todo Use Bcrypt to hash the password before saving it to the database
 */
@Injectable()
export class UsersService {
  logger: Logger;

  constructor(private prisma: PrismaService) {
    this.logger = new Logger('UsersService');
  }

  async createUser(user: CreateUserDto) {
    try {
      return await this.prisma.user.create({
        data: {
          id: user.id.toString(),
          email: user.email,
          phoneNumber: user.phoneNumber,
          name: user.name,
          role: user.role,
          password: user.password,
          birthDate: new Date(user.birthDate), // Transforma el valor recibido a una instancia de Date
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('Error creating user', 400);
    }
  }

  async findOneByemail(email: string) {
    try {
      return await this.prisma.user.findFirst({
        where: {
          email: email,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('Error finding user', 400);
    }
  }

  async findOneByphoneNumber(phoneNumber: string) {
    try {
      return await this.prisma.user.findFirst({
        where: {
          phoneNumber: phoneNumber,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('Error finding user', 400);
    }
  }

  async getUsers() {
    try {
      return await this.prisma.user.findMany();
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('Error getting users', 400);
    }
  }

  async deleteUserById(id: string) {
    try {
      return await this.prisma.user.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      this.logger.error(error);
      if (error.code === 'P2025') {
        throw new HttpException('Usuario no encontrado', 404);
      }
      throw new HttpException('Error', 400);
    }
  }

  async updateUserById(id: string, updatedData: UpdateUserDto) {
    try {
      return await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          phoneNumber: updatedData.phoneNumber,
          name: updatedData.name,
          role: updatedData.role,
          password: updatedData.password,
          birthDate: updatedData.birthDate,
        },
      });
    } catch (error) {
      this.logger.error(error);
      if (error.code === 'P2025') {
        throw new HttpException('Usuario no encontrado', 404);
      }
      throw new HttpException('Error', 400);
    }
  }
}
