import { UserRole } from '../entities/user.entity';
import { IsString, IsEmail, IsEnum, IsDate, IsNotEmpty } from 'class-validator';  
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsDate()
  @Transform(({ value }) => new Date(value)) // Convierte el valor recibido a una instancia de Date
  birthDate: Date;
}
