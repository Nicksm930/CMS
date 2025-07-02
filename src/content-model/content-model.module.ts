import { Module } from '@nestjs/common';
import { ContentModelService } from './content-model.service';
import { ContentModelController } from './content-model.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentModel, ContentModelSchema } from './entities/content-model.entity';

@Module({
  imports:[
    MongooseModule.forFeature(
      [
        {name:ContentModel.name , schema:ContentModelSchema}
      ]
    )
  ],
  controllers: [ContentModelController],
  providers: [ContentModelService],
  exports:[MongooseModule]
})
export class ContentModelModule {}
