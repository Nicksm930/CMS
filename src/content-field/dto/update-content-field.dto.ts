import { PartialType } from '@nestjs/mapped-types';
import { CreateContentFieldDto } from './create-content-field.dto';

export class UpdateContentFieldDto extends PartialType(CreateContentFieldDto) {}
