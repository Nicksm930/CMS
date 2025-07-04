import { IsNotEmpty, IsString, MinLength } from 'class-validator';

// import { Type } from "class-transformer";
// import { CreateContentFieldDto } from "src/content-field/dto/create-content-field.dto";

export class CreateContentModelDto {
  @IsString({ message: 'Model Name Should be String' })
  @IsNotEmpty({ message: 'Model Name should not be empty' })
  @MinLength(3, { message: 'Model Name must be atleast 3 characters' })
  modelName: string;
}
