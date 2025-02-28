import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HistoricalService } from './historical.service';
import { CreateHistoricalDto } from './dto/create-historical.dto';
import { UpdateHistoricalDto } from './dto/update-historical.dto';

@Controller('historical')
export class HistoricalController {
  constructor(private readonly historicalService: HistoricalService) {}

  @Post()
  create(@Body() createHistoricalDto: CreateHistoricalDto) {
    return this.historicalService.create(createHistoricalDto);
  }

  @Get()
  findAll() {
    return this.historicalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historicalService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHistoricalDto: UpdateHistoricalDto) {
    return this.historicalService.update(+id, updateHistoricalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historicalService.remove(+id);
  }
}
