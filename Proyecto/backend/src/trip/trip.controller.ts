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
} from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { JwtAuthGuard } from 'src/core/auth/guard/jwt-auth.guard';
import { UserCreateTripDto } from './dto/user-create-trip.dto';
import { DriverCreateTripDto } from './dto/driver-create-trip.dto';
import { AcceptTripDto } from './dto/AcceptTrip.dto';

@UseGuards(JwtAuthGuard)
@Controller('trip')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post()
  create(@Body() createTripDto: CreateTripDto, @Request() req) {
    return this.tripService.create(createTripDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.tripService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tripService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTripDto: UpdateTripDto) {
    return this.tripService.update(id, updateTripDto);
  }

  @Get('/passengers/:tripId')
  getPassengers(@Param('tripId') tripId: string) {
    return this.tripService.findAllPassengersTrip(tripId);
  }

  @Post('/user-solicitate-trip')
  userSolicitateTrip(
    @Body() userCreateTripDto: UserCreateTripDto,
    @Request() req,
  ) {
    return this.tripService.userCreateTrip(userCreateTripDto, req.user.userId);
  }

  @Post('/driver-solicitate-trip')
  driverSolicitateTrip(
    @Body() driverCreateTrip: DriverCreateTripDto,
    @Request() req,
  ) {
    return this.tripService.driverCreateTrip(driverCreateTrip, req.user.userId);
  }

  @Post('/accept-trip')
  acceptTrip(@Body() tripId: AcceptTripDto, @Request() req) {
    return this.tripService.driverAcceptTrip(tripId, req.user.userId);
  }

  @Post('/user-accept-trip')
  userAcceptTrip(@Body() tripId: AcceptTripDto, @Request() req) {
    return this.tripService.userJoinTrip(tripId, req.user.userId);
  }
}
