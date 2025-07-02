import { Test, TestingModule } from '@nestjs/testing';
import { ContentEntryController } from './content-entry.controller';
import { ContentEntryService } from './content-entry.service';

describe('ContentEntryController', () => {
  let controller: ContentEntryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentEntryController],
      providers: [ContentEntryService],
    }).compile();

    controller = module.get<ContentEntryController>(ContentEntryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
