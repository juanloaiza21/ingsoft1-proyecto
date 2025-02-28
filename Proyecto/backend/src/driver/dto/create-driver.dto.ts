import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateDriverDto {
  @IsString()
  @IsNotEmpty()
  runtNumber: string;

  @IsNotEmpty()
  @IsDateString()
  licenseExpirationDate: string;
}
