import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ContentModelService } from './content-model.service';
import { CreateContentModelDto } from './dto/create-content-model.dto';
import { UpdateContentModelDto } from './dto/update-content-model.dto';
import { ContentModelDocument } from './entities/content-model.entity';

@Controller('content-model')
export class ContentModelController {
  constructor(private readonly contentModelService: ContentModelService) {}

  @Post(':id')
  create(
    @Param('id') id: string,
    @Body() createContentModelDto: CreateContentModelDto,
  ): Promise<ContentModelDocument> {
    return this.contentModelService.create(id, createContentModelDto);
  }

  @Get()
  findAll(): Promise<ContentModelDocument[] | null> {
    return this.contentModelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentModelService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContentModelDto: UpdateContentModelDto,
  ) {
    return this.contentModelService.update(+id, updateContentModelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contentModelService.remove(+id);
  }
}
