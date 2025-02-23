import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignInDTO } from './dto/singin.dto';
import { UtilsService } from '@app/utils';
import { Payload } from './types/payload.types';
import { Tokens } from './types/tokens.types';

@Injectable()
export class AuthService {
  logger: Logger;
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly utils: UtilsService,
  ) {
    this.logger = new Logger('AuthService');
  }

  async validateUser(credentials: SignInDTO): Promise<any> {
    const user = await this.usersService.findOneByemail(credentials.email);
    if (
      user &&
      (await this.utils.comparePassword(credentials.password, user.password))
    ) {
      const { password, ...result } = user;
      return await this.login(user);
    }
    throw new UnauthorizedException();
  }

  async login(user: any): Promise<Tokens> {
    const payload: Payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };
    const tokens = await this.generateToken(payload);
    await this.updateRtHash(tokens.refresh_token, payload);
    return tokens;
  }

  private async generateToken(user: Payload): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(user, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '60s',
      }),
      this.jwtService.signAsync(user, {
        secret: this.configService.get('JWT_SECRET_REFRESH'),
        expiresIn: '7d',
      }),
    ]);
    return { access_token: accessToken, refresh_token: refreshToken };
  }

  private async updateRtHash(
    refreshToken: string,
    payload: Payload,
  ): Promise<void> {
    const rtHash = await this.utils.hashPassword(refreshToken);
    await this.usersService.updateUserById(payload.sub, {
      refreshToken: rtHash,
    });
  }

  async refreshTokens(refreshToken: string): Promise<Tokens> {
    const payload: Payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.get('JWT_SECRET_REFRESH'),
    });
    const user = await this.usersService.findOneByemail(payload.email);
    if (!user) {
      throw new UnauthorizedException();
    }
    const validation = await this.utils.comparePassword(
      refreshToken,
      user.refreshToken,
    );
    if (!validation) {
      throw new UnauthorizedException();
    }
    const tokens = await this.generateToken({
      email: user.email,
      sub: user.id,
      role: user.role,
    });
    await this.updateRtHash(tokens.refresh_token, payload);
    return tokens;
  }
}
