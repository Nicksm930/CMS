import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { UserRole } from "src/users/enums/users.enum"

export class CreateRegisterDto{

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email:string

  @IsString()
  @IsNotEmpty()
  password:string

  @IsEnum(UserRole)
  @IsNotEmpty()
  user_role:UserRole

  @IsString()
  @IsOptional()
  access_token:string
}