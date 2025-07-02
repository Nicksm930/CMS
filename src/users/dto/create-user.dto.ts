import {
  IsEmail,
  isEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  isString,
  IsString,
} from 'class-validator';
import { UserRole } from '../enums/users.enum';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Email must not be empty' })
  @IsString({ message: 'Email should eg: xyz@example.com' })
  @IsEmail({}, { message: 'Email should eg: xyz@example.com' })
  email: string;

  @IsNotEmpty({ message: 'Password must not be empty' })
  @IsString()
  password: string;

  @IsEnum(UserRole, { message: 'Role must be either admin or author' })
  user_role: UserRole;
}
