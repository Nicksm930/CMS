import { Test, TestingModule } from '@nestjs/testing';
import { ContentEntryService } from './content-entry.service';

describe('ContentEntryService', () => {
  let service: ContentEntryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentEntryService],
    }).compile();

    service = module.get<ContentEntryService>(ContentEntryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
