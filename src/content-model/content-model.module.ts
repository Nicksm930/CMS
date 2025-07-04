import { Module } from '@nestjs/common';
import { ContentModelService } from './content-model.service';
import { ContentModelController } from './content-model.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ContentModel,
  ContentModelSchema,
} from './entities/content-model.entity';
import { ContentField, ContentFieldSchema } from 'src/content-field/entities/content-field.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ContentModel.name, schema: ContentModelSchema },
      {
        name:ContentField.name , schema: ContentFieldSchema
      }
    ]),
  ],
  controllers: [ContentModelController],
  providers: [ContentModelService],
  exports: [MongooseModule],
})
export class ContentModelModule {}
