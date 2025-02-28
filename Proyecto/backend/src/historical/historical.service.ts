import { Injectable } from '@nestjs/common';
import { CreateHistoricalDto } from './dto/create-historical.dto';
import { UpdateHistoricalDto } from './dto/update-historical.dto';

@Injectable()
export class HistoricalService {
  create(createHistoricalDto: CreateHistoricalDto) {
    return 'This action adds a new historical';
  }

  findAll() {
    return `This action returns all historical`;
  }

  findOne(id: number) {
    return `This action returns a #${id} historical`;
  }

  update(id: number, updateHistoricalDto: UpdateHistoricalDto) {
    return `This action updates a #${id} historical`;
  }

  remove(id: number) {
    return `This action removes a #${id} historical`;
  }
}
