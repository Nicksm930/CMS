import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ContentEntry {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  owner: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  model: mongoose.Types.ObjectId;

  @Prop({
    type: Object,
    required: true,
  })
  data: Record<string, any>;

  @Prop({
    type: Boolean,
    default: true,
  })
  isDrafted: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  isPublished: boolean;
}

export type ContentEntryDocument = ContentEntry & Document;
export const ContentEntrySchema = SchemaFactory.createForClass(ContentEntry);
