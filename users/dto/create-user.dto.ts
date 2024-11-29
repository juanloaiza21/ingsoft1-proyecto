import {Role} from '../../common/enums/role.enum'
import { IsString, IsEmail, IsEnum, IsDateString, IsNotEmpty } from 'class-validator';  

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsDateString()
  birthDate: string;
}
