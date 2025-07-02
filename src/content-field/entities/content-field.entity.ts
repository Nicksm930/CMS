import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { DataTypes } from 'src/content-field/enums/datatype.enum';

@Schema({ timestamps: true })
export class ContentField {
  @Prop({
    type: String,
    required: true,
  })
  uid: string;

  @Prop({
    type: String,
    required: true,
  })
  displayName: string;

  @Prop({
    enum: DataTypes,
    type: String,
    required: true,
  })
  dataType: DataTypes;

  @Prop({
    type: Boolean,
    required: true,
  })
  isMandatory: boolean;

  @Prop({
    type: Boolean,
    required: true,
  })
  isMultiple: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ContentModel',
    required: true,
  })
  model: mongoose.Types.ObjectId;
}

export type ContentFieldDocument = ContentField & Document;
export const ContentFieldSchema = SchemaFactory.createForClass(ContentField);
ContentFieldSchema.index({ model: 1, uid: 1 }, { unique: true });
