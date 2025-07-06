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
import { Role } from 'src/auth/decorators/role.decorator';
import { ContentEntryDocument } from './entities/content-entry.entity';

@Controller('content-entry')
export class ContentEntryController {
  constructor(private readonly contentEntryService: ContentEntryService) {}

  @Role('admin', 'author')
  @Post(':userId/:modelId')
  create(
    @Param('userId') userId: string,
    @Param('modelId') modelId: string,
    @Body() createContentEntryDto: CreateContentEntryDto,
  ) {
    return this.contentEntryService.create(
      userId,
      modelId,
      createContentEntryDto,
    );
  }

  @Role('admin')
  @Get()
  findAll(): Promise<ContentEntryDocument[]> {
    return this.contentEntryService.findAll();
  }
  @Role('admin', 'author', 'public')
  @Get('published')
  findAllPublished(
    @Param('userId') userId?: string,
  ): Promise<ContentEntryDocument[]> {
    return this.contentEntryService.findPublishedAll(userId || undefined);
  }

  @Role('admin', 'author')
  @Get(':userId/:entryId')
  findOne(
    @Param('userId') userId: string,
    @Param('entryID') entryId: string,
  ): Promise<ContentEntryDocument> {
    return this.contentEntryService.findOne(userId, entryId);
  }

  @Role('admin', 'author')
  @Patch(':userId/:entryID')
  update(
    @Param('userId') userId: string,
    @Param('entryID') entryId: string,
    @Body() updateContentEntryDto: UpdateContentEntryDto,
  ): Promise<ContentEntryDocument> {
    return this.contentEntryService.update(
      userId,
      entryId,
      updateContentEntryDto,
    );
  }

  @Role('admin', 'author')
  @Delete(':userId/:entryId')
  remove(
    @Param('userId') userId: string,
    @Param('entryID') entryId: string,
  ): Promise<Record<string, string>> {
    return this.contentEntryService.remove(userId, entryId);
  }

  @Role('admin', 'author')
  @Patch('publish/:userId/:entryId')
  publishEntry(
    @Param('userID') userId: string,
    @Param('entryId') entryId: string,
  ): Promise<ContentEntryDocument> {
    return this.contentEntryService.publishEntry(userId, entryId);
  }
}
