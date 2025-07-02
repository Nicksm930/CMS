import { PartialType } from '@nestjs/mapped-types';
import { CreateContentModelDto } from './create-content-model.dto';

export class UpdateContentModelDto extends PartialType(CreateContentModelDto) {}
