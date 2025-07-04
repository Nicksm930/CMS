import { IsArray, IsMongoId, ArrayNotEmpty } from 'class-validator';

export class AssignUserDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  assigned_users: string[];
}
