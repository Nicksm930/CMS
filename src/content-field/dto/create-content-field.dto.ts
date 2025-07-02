import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { DataTypes } from 'src/content-field/enums/datatype.enum';

export class CreateContentFieldDto {
  @IsString({ message: 'UID  Should be String' })
  @IsNotEmpty({ message: 'UID  should not be empty' })
  @MinLength(3, { message: 'UID  must be atleast 3 characters' })
  uid: string;

  @IsString({ message: 'Display Name Should be String' })
  @IsNotEmpty({ message: 'Display Name should not be empty' })
  @MinLength(3, { message: 'Display Name must be atleast 3 characters' })
  displayName: string;

  @IsEnum(DataTypes, {
    message: `Select fields ${Object.values(DataTypes).join(',')}`,
  })
  dataType: DataTypes;

  @IsBoolean()
  @IsNotEmpty()
  isMandatory: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isMultiple: boolean;
}
