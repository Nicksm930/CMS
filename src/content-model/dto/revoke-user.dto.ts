import { ArrayNotEmpty, IsArray, IsMongoId } from 'class-validator';

export class RevokeUserDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  revoked_users: string[];
}
