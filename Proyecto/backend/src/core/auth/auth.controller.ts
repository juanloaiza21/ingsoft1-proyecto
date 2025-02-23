import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { SignInDTO } from './dto/singin.dto';
import { RtGuard } from './guard/jwt-refresh.guard';

@Controller('auth')
/**
 * @todo Agregar manejo bajo roles
 *
 */
export class AuthController {
  logger: Logger;
  constructor(private authService: AuthService) {
    this.logger = new Logger('AuthController');
  }

  @Post('login')
  async login(@Body() user: SignInDTO) {
    return this.authService.validateUser(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  async refresh(@Request() req) {
    return this.authService.refreshTokens(req.user.refreshToken);
  }
}
