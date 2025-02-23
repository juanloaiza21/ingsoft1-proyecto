import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../core/prisma/prisma.service';
import { UtilsModule } from '@app/utils';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  exports: [UsersService],
  imports: [UtilsModule],
})
export class UsersModule {}
