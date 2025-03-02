import { Test, TestingModule } from '@nestjs/testing';
import { CalificationController } from './calification.controller';
import { CalificationService } from './calification.service';

describe('CalificationController', () => {
  let controller: CalificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalificationController],
      providers: [CalificationService],
    }).compile();

    controller = module.get<CalificationController>(CalificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
