import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { Prisma } from '@prisma/client';
import { PrismaService } from '../core/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';




@Injectable()
export class UsersService {

  constructor(private prisma: PrismaService) { }

  createUser(user: CreateUserDto) {
    return this.prisma.user.create({
      data: { 
        email: user.email,
        phoneNumber: user.phoneNumber,
        name: user.name,
        role: user.role,
        password: user.password,
        birthDate: new Date(user.birthDate), //Transforma el valor recibido a una instancia de Date
      }
    }
    );
  }

  //   findOneByemail(email: string){
  //     return this.prisma.user.findFirst({
  //       where: { email:email },
  //       select: {
  //           id: true,
  //           email: true,
  //           password: true, 
  //       },
  //   });
  // }

  findOneByemail(email: string) {
    return this.prisma.user.findFirst({
      where: {
        email: email
      }
    });
  }

  findOneByphoneNumber(phoneNumber: string) {
    return this.prisma.user.findFirst({
      where: {
        phoneNumber: phoneNumber
      }
    });
  }

  getUsers() {
    return this.prisma.user.findMany();
  }

  deleteUserById(id: string) {
    try {
      return this.prisma.user.delete({
        where: {
          id: id
        }
      });
    } catch (error) {
      if (error.code === "P2025") {
        console.log("USUARIO NO ENCONTRADO");
      }
    }
  }

  updateUserById(id: string, updatedData: UpdateUserDto) {
    try {
      return this.prisma.user.update({
        where: {
          id: id
        },
        data: {
          email: updatedData.email,
          phoneNumber: updatedData.phoneNumber,
          name: updatedData.name,
          role: updatedData.role,
          password: updatedData.password,
          birthDate: updatedData.birthDate
        }
      });
    } catch (error) {
      if (error.code === "P2025") {
        console.log("USUARIO NO ENCONTRADO");
      }
    }
  }
}
