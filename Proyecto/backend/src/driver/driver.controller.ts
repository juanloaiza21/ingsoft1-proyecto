import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { JwtAuthGuard } from 'src/core/auth/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @HttpCode(201)
  @Post()
  create(@Body() createDriverDto: CreateDriverDto, @Request() req) {
    return this.driverService.create(createDriverDto, req.user.userId);
  }

  @Get('all')
  findAll() {
    return this.driverService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.driverService.findOne(id);
  }

  @HttpCode(204)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto) {
    return this.driverService.update(id, updateDriverDto);
  }

  @HttpCode(200)
  @Get('/trip/:id')
  async findTrips(@Param('id') id: string, @Request() req) {
    return await this.driverService.findTrips(id, req.user.userId);
  }
}
