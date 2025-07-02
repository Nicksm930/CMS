import { Module } from '@nestjs/common';
import { ContentFieldService } from './content-field.service';
import { ContentFieldController } from './content-field.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentField, ContentFieldSchema } from './entities/content-field.entity';
import { ContentModelModule } from 'src/content-model/content-model.module';


@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name:ContentField.name ,schema:ContentFieldSchema
      }
    ]),
    ContentModelModule
  ],
  controllers: [ContentFieldController],
  providers: [ContentFieldService],
})
export class ContentFieldModule {}
