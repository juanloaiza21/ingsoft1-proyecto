import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { CalificationService } from './calification.service';
import { CreateCalificationDto } from './dto/create-calification.dto';
import { UpdateCalificationDto } from './dto/update-calification.dto';
import { JwtAuthGuard } from 'src/core/auth/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('calification')
export class CalificationController {
  constructor(private readonly calificationService: CalificationService) {}
  @HttpCode(201)
  @Post()
  create(@Body() createCalificationDto: CreateCalificationDto) {
    return this.calificationService.create(createCalificationDto);
  }

  @HttpCode(200)
  @Get('all/:userId')
  findAll(@Param('userId') userId: string) {
    return this.calificationService.findAll(userId);
  }

  @HttpCode(200)
  @Get('prom/:id')
  findOne(@Param('id') id: string) {
    return this.calificationService.getCalificationsByUserId(id);
  }
}
