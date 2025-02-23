import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
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
  @HttpCode(HttpStatus.CREATED)
  async login(@Body() user: SignInDTO) {
    return this.authService.validateUser(user);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.FOUND)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('refresh')
  async refresh(@Request() req) {
    return this.authService.refreshTokens(req.user.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Request() req) {
    return this.authService.logOut(req.user.userId);
  }
}
