import { IsNotEmpty, IsObject } from "class-validator";

export class CreateContentEntryDto {
  @IsNotEmpty({ message: 'Entry data must not be empty' })
  @IsObject({ message: 'Entry must be a valid key-value object' })
  values: Record<string, any>;
}
