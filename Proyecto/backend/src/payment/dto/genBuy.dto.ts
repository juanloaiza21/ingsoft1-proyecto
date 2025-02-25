import {
  IsString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
} from 'class-validator';
import { PaymentMethod } from '../enum/payment.enum';

export class GenerateBuyDTO {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  method: PaymentMethod;

  @IsString()
  @IsNotEmpty()
  tripId: string;

  @IsNumberString()
  @IsNotEmpty()
  value: string;
}
