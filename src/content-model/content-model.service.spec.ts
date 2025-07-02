import { Test, TestingModule } from '@nestjs/testing';
import { ContentModelService } from './content-model.service';

describe('ContentModelService', () => {
  let service: ContentModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentModelService],
    }).compile();

    service = module.get<ContentModelService>(ContentModelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
