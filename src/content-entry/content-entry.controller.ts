import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ContentEntryService } from './content-entry.service';
import { CreateContentEntryDto } from './dto/create-content-entry.dto';
import { UpdateContentEntryDto } from './dto/update-content-entry.dto';

@Controller('content-entry')
export class ContentEntryController {
  constructor(private readonly contentEntryService: ContentEntryService) {}

  @Post(':userId/:modelId')
  create(
    @Param('userId') userId: string,
    @Param('modelId') modelId: string,
    @Body() createContentEntryDto: CreateContentEntryDto,
  ) {
    return this.contentEntryService.create(userId,modelId,createContentEntryDto);
  }

  @Get()
  findAll() {
    return this.contentEntryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentEntryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContentEntryDto: UpdateContentEntryDto,
  ) {
    return this.contentEntryService.update(+id, updateContentEntryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contentEntryService.remove(+id);
  }
}
