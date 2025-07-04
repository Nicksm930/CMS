import { Module } from '@nestjs/common';
import { ContentEntryService } from './content-entry.service';
import { ContentEntryController } from './content-entry.controller';
import { ContentFieldModule } from 'src/content-field/content-field.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ContentEntry,
  ContentEntrySchema,
} from './entities/content-entry.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ContentEntry.name,
        schema: ContentEntrySchema,
      },
    ]),
    ContentFieldModule,
  ],
  controllers: [ContentEntryController],
  providers: [ContentEntryService],
})
export class ContentEntryModule {}
