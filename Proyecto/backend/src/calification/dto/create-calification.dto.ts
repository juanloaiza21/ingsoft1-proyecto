import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCalificationDto {
  @IsNumber()
  @IsNotEmpty()
  score: number;

  @IsString()
  @IsNotEmpty()
  userCalificatedId: number;

  @IsString()
  @IsOptional()
  comment?: string;
}
