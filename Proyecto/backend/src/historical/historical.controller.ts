import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Request,
} from '@nestjs/common';
import { HistoricalService } from './historical.service';
import { CreateHistoricalDto } from './dto/create-historical.dto';
import { UpdateHistoricalDto } from './dto/update-historical.dto';
import { JwtAuthGuard } from 'src/core/auth/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('historical')
export class HistoricalController {
  constructor(private readonly historicalService: HistoricalService) {}

  @Get('trips-user/:id')
  findAll(@Param('id') id: string) {
    return this.historicalService.findAllTripsUser(id);
  }

  @Get('bills/:id')
  findAllBills(@Param('id') id: string) {
    return this.historicalService.findAllBills(id);
  }
}
