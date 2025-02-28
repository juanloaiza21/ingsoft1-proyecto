import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CalificationService } from './calification.service';
import { CreateCalificationDto } from './dto/create-calification.dto';
import { UpdateCalificationDto } from './dto/update-calification.dto';

@Controller('calification')
export class CalificationController {
  constructor(private readonly calificationService: CalificationService) {}

  @Post()
  create(@Body() createCalificationDto: CreateCalificationDto) {
    return this.calificationService.create(createCalificationDto);
  }

  @Get()
  findAll() {
    return this.calificationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.calificationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCalificationDto: UpdateCalificationDto) {
    return this.calificationService.update(+id, updateCalificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.calificationService.remove(+id);
  }
}
