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
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './entities/user.entity';
import { UserPagination } from './interfaces/user-pagination.interface';
import { Role } from 'src/auth/decorators/role.decorator';
import { ContentModelDocument } from 'src/content-model/entities/content-model.entity';


// @UseGuards(AuthorizeGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Role('admin')
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit: number,
  ): Promise<{ data: UserDocument[]; metaData: UserPagination }> {
    return this.usersService.findAll(page, limit);
  }

  @Role('admin', 'author')
  @Get(':id')
  findOne(@Param('id') id: string): Promise<{ user: UserDocument; model: ContentModelDocument[] }> {
    return this.usersService.findOne(id);
  }

  @Role('admin', 'author')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.usersService.update(id, updateUserDto);
  }

  @Role('admin', 'author')
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Record<string, string>> {
    return this.usersService.remove(id);
  }
}
