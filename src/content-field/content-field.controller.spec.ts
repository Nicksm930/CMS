import { Test, TestingModule } from '@nestjs/testing';
import { ContentFieldController } from './content-field.controller';
import { ContentFieldService } from './content-field.service';

describe('ContentFieldController', () => {
  let controller: ContentFieldController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentFieldController],
      providers: [ContentFieldService],
    }).compile();

    controller = module.get<ContentFieldController>(ContentFieldController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
