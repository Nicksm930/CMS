import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from '../enums/users.enum';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    unique: true,
    required: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    enum: UserRole,
    type: String,
    default: UserRole.author,
  })
  user_role: UserRole;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
