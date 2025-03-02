import { Test, TestingModule } from '@nestjs/testing';
import { CalificationService } from './calification.service';

describe('CalificationService', () => {
  let service: CalificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalificationService],
    }).compile();

    service = module.get<CalificationService>(CalificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
