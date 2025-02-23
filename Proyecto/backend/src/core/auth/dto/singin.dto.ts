
import {
  IsString,
  IsEmail,
} from 'class-validator';

export class SignInDTO {

  @IsEmail()
  email: string;

  @IsString()
  password: string;

}
