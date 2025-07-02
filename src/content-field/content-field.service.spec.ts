import { Test, TestingModule } from '@nestjs/testing';
import { ContentFieldService } from './content-field.service';

describe('ContentFieldService', () => {
  let service: ContentFieldService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentFieldService],
    }).compile();

    service = module.get<ContentFieldService>(ContentFieldService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
