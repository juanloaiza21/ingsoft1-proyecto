import { IsNotEmpty, IsString } from 'class-validator';

export class AcceptTripDto {
  @IsString()
  @IsNotEmpty()
  tripId: string;
}
