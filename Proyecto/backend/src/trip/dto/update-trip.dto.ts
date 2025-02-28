import { PartialType } from '@nestjs/mapped-types';
import { CreateTripDto } from './create-trip.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTripDto extends PartialType(CreateTripDto) {
  @IsString()
  @IsOptional()
  idUser?: string;

  @IsString()
  @IsOptional()
  idDriver?: string;

  @IsNumber()
  @IsOptional()
  price?: number;
}
