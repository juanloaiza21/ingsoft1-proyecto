import { Injectable } from '@nestjs/common';
import { CreateCalificationDto } from './dto/create-calification.dto';
import { UpdateCalificationDto } from './dto/update-calification.dto';

@Injectable()
export class CalificationService {
  create(createCalificationDto: CreateCalificationDto) {
    return 'This action adds a new calification';
  }

  findAll() {
    return `This action returns all calification`;
  }

  findOne(id: number) {
    return `This action returns a #${id} calification`;
  }

  update(id: number, updateCalificationDto: UpdateCalificationDto) {
    return `This action updates a #${id} calification`;
  }

  remove(id: number) {
    return `This action removes a #${id} calification`;
  }
}
