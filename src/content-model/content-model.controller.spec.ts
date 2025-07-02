import { Test, TestingModule } from '@nestjs/testing';
import { ContentModelController } from './content-model.controller';
import { ContentModelService } from './content-model.service';

describe('ContentModelController', () => {
  let controller: ContentModelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentModelController],
      providers: [ContentModelService],
    }).compile();

    controller = module.get<ContentModelController>(ContentModelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
