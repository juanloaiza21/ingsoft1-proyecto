import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';



@Injectable()
export class UsersService {

  constructor(private prisma: PrismaService){}

  createUser(user:CreateUserDto){
    return this.prisma.user.create({data: user});
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

  findOneByemail(email:string){
    return this.prisma.user.findFirst({
      where:{
        email:email
      }

    });
  }

  findOneByphoneNumber(phoneNumber: string){
    return this.prisma.user.findFirst({
      where: {
        phoneNumber: phoneNumber
      }
    });
  }

  getUsers(){
    return this.prisma.user.findMany();
  }
  // findAll() {
  //   return `This action returns all users`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
