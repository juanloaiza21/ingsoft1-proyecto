import {Role} from '../../common/enums/role.enum'
import { IsString, IsEmail, IsEnum, IsDateString, IsNotEmpty, MinLength } from 'class-validator';  
import {Transform} from 'class-transformer'
export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  @Transform(({value}) => value.trim())
  @IsString()
  @MinLength(6)
  password: string;

  @IsDateString()
  birthDate: string;
}
