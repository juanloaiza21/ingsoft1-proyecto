import { PartialType } from '@nestjs/mapped-types';
import { CreateCalificationDto } from './create-calification.dto';

export class UpdateCalificationDto extends PartialType(CreateCalificationDto) {}
