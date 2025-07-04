import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, mongo, Mongoose } from 'mongoose';

@Schema({ timestamps: true })
export class ContentModel {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  modelName: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ContentField' }],default:[]
  })
  fields: mongoose.Types.ObjectId[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  owner: mongoose.Types.ObjectId;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    default: [],
  })
  assigned_users: mongoose.Types.ObjectId[];
}

export type ContentModelDocument = ContentModel & Document;
export const ContentModelSchema = SchemaFactory.createForClass(ContentModel);
