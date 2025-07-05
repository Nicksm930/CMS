import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ContentModelService } from './content-model.service';
import { CreateContentModelDto } from './dto/create-content-model.dto';
import { UpdateContentModelDto } from './dto/update-content-model.dto';
import { ContentModelDocument } from './entities/content-model.entity';
import { AssignUserDto } from './dto/assign-user.dto';
import { RevokeUserDto } from './dto/revoke-user.dto';
import { ContentModelPagination } from './interfaces/content-model-pagination.interface';

@Controller('content-model')
export class ContentModelController {
  constructor(private readonly contentModelService: ContentModelService) {}

  @Post(':id')
  create(
    @Param('id') id: string,
    @Body() createContentModelDto: CreateContentModelDto,
  ): Promise<ContentModelDocument> {
    console.log(id);
    console.log(createContentModelDto);

    return this.contentModelService.create(id, createContentModelDto);
  }

  @Get()
  findAll(
     @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
      @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
  ): Promise<{data:ContentModelDocument[] | null;metaData:ContentModelPagination}> {
    return this.contentModelService.findAll(page,limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ContentModelDocument> {
    return this.contentModelService.findOne(id);
  }

  @Get('/model/:name')
  findOneByName(@Param('name') name: string): Promise<ContentModelDocument> {
    console.log(name);
    return this.contentModelService.findOneByName(name);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContentModelDto: UpdateContentModelDto,
  ) {
    return this.contentModelService.update(id, updateContentModelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Record<string, string>> {
    return this.contentModelService.remove(id);
  }

  @Patch('/assign/:model_id')
  assignUser(
    @Param('model_id') model_id: string,
    @Body() assignUserDto: AssignUserDto,
  ): Promise<ContentModelDocument> {
    return this.contentModelService.assignUser(model_id, assignUserDto);
  }

  @Patch('/revoke/:model_id')
  revokeUser(
    @Param('model_id') model_id: string,
    @Body() revokeUserDto: RevokeUserDto,
  ): Promise<ContentModelDocument> {
    return this.contentModelService.revokeUser(model_id, revokeUserDto);
  }
}
