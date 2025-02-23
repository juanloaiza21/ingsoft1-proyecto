import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignInDTO } from './dto/singin.dto';

@Injectable()
export class AuthService {
  logger: Logger;
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.logger = new Logger('AuthService');
  }

  async validateUser(credentials: SignInDTO): Promise<any> {
    const user = await this.usersService.findOneByemail(credentials.email);
    if (user && user.password === credentials.password) {
      const { password, ...result } = user;
      return await this.login(user);
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: "60s",
      }),
    };
  }
}
