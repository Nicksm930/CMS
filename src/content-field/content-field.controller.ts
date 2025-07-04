import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ContentFieldService } from './content-field.service';
import { CreateContentFieldDto } from './dto/create-content-field.dto';
import { UpdateContentFieldDto } from './dto/update-content-field.dto';
import { ContentFieldDocument } from './entities/content-field.entity';

@Controller('content-field')
export class ContentFieldController {
  constructor(private readonly contentFieldService: ContentFieldService) {}

  @Post(':id/:user_id')
  create(
    @Param('id') id: string,
    @Param('user_id') user_id: string,
    @Body() createContentFieldDto: CreateContentFieldDto,
  ) {
    return this.contentFieldService.create(id,user_id,createContentFieldDto);
  }

  @Get(':modelId')
  findAllByModelID(
    @Param('modelId') modelId: string,
  ): Promise<ContentFieldDocument[]> {
    return this.contentFieldService.findAllByModelID(modelId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ContentFieldDocument> {
    return this.contentFieldService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContentFieldDto: UpdateContentFieldDto,
  ): Promise<ContentFieldDocument> {
    return this.contentFieldService.update(id, updateContentFieldDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Record<string, string>> {
    return this.contentFieldService.remove(id);
  }
}
