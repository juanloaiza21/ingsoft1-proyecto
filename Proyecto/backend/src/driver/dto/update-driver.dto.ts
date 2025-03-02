import { PartialType } from '@nestjs/mapped-types';
import { CreateDriverDto } from './create-driver.dto';
import { IsDateString, IsOptional } from 'class-validator';

export class UpdateDriverDto extends PartialType(CreateDriverDto) {
  @IsDateString()
  @IsOptional()
  licenseExpirationDate?: string;
}
