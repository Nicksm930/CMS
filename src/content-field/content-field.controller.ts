import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContentFieldService } from './content-field.service';
import { CreateContentFieldDto } from './dto/create-content-field.dto';
import { UpdateContentFieldDto } from './dto/update-content-field.dto';

@Controller('content-field')
export class ContentFieldController {
  constructor(private readonly contentFieldService: ContentFieldService) {}

  @Post(':id')
  create(@Param('id') id:string ,@Body() createContentFieldDto: CreateContentFieldDto) {
    return this.contentFieldService.create(id,createContentFieldDto);
  }

  @Get()
  findAll() {
    return this.contentFieldService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentFieldService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContentFieldDto: UpdateContentFieldDto) {
    return this.contentFieldService.update(+id, updateContentFieldDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contentFieldService.remove(+id);
  }
}
