import { IsString, IsNotEmpty, IsNumber, IsEmail } from 'class-validator';

export class GenerateBuyDTO {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  method: string;

  @IsString()
  @IsNotEmpty()
  tripId: string;

  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsString()
  @IsEmail()
  email: string;
}
