import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateContentEntryDto } from './dto/create-content-entry.dto';
import { UpdateContentEntryDto } from './dto/update-content-entry.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  ContentField,
  ContentFieldDocument,
} from 'src/content-field/entities/content-field.entity';
import mongoose, { Model } from 'mongoose';
import {
  ContentEntry,
  ContentEntryDocument,
} from './entities/content-entry.entity';

@Injectable()
export class ContentEntryService {
  constructor(
    @InjectModel(ContentField.name)
    private readonly contentFieldModel: Model<ContentFieldDocument>,
    @InjectModel(ContentEntry.name)
    private readonly contentEntryModel: Model<ContentEntryDocument>,
  ) {}

  async create(
    userId: string,
    modelId: string,
    createContentEntryDto: CreateContentEntryDto,
  ) {
    // console.log('userId', userId);
    // console.log('modelId', modelId);
    // console.log('Body', createContentEntryDto.values);
    // console.log('Object Info',Object.keys(createContentEntryDto.values).map(async (value,key)=>{
    //   console.log("key",key,"value",value);
    // }));
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid User ID');
      }
      if (!mongoose.Types.ObjectId.isValid(modelId)) {
        throw new BadRequestException('Invalid Model ID');
      }
      const userData = createContentEntryDto.values;
      console.log('UserData', userData);

      const modelFields = await this.contentFieldModel.find({ model: modelId });
      console.log(modelFields);

      let payload = {};

      modelFields.forEach((field: ContentFieldDocument) => {
        const value = userData[field.uid];
        if (
          field.isMandatory &&
          (value === undefined ||
            value === null ||
            value === '' ||
            (field.isMultiple && !Array.isArray(value)))
        ) {
          throw new BadRequestException(
            `Field "${field.displayName}" is mandatory`,
          );
        }
        if (field.isMultiple && value !== undefined && !Array.isArray(value)) {
          throw new BadRequestException(
            `Field "${field.displayName}" must be an array`,
          );
        }

        payload = { ...payload, [field.uid]: value ?? null };
      });

      const contentEntered = await this.contentEntryModel.create({
        owner: userId,
        model: modelId,
        data: payload,
      });

      return contentEntered;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findAll(): Promise<ContentEntryDocument[]> {
    try {
      const entries = await this.contentEntryModel.find();
      if (!entries.length) {
        throw new NotFoundException('No Entires Found');
      }
      return entries;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Something Went Wrong');
    }
  }

  async findPublishedAll(userId?: string): Promise<ContentEntryDocument[]> {
    try {
      if (userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          throw new BadRequestException('Invalid id');
        }
        const entries = await this.contentEntryModel.find({
          owner: userId,
          isPublished: true,
        });
        if (!entries.length) {
          throw new NotFoundException('No Entires Found');
        }
        return entries;
      } else {
        const entries = await this.contentEntryModel.find({
          isPublished: true,
        });
        if (!entries.length) {
          throw new NotFoundException('No Entires Found');
        }
        return entries;
      }
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Something Went Wrong');
    }
  }

  async publishEntry(
    userId: string,
    entryId: string,
  ): Promise<ContentEntryDocument> {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid User ID');
      }
      if (!mongoose.Types.ObjectId.isValid(entryId)) {
        throw new BadRequestException('Invalid Entry ID');
      }

      const valid_user_entry = await this.contentEntryModel.findOne({
        _id: entryId,
        owner: userId,
      });
      if (!valid_user_entry) {
        throw new NotFoundException('Entry Not Found / User Not Authorized');
      }

      const published_entry = await this.contentEntryModel.findByIdAndUpdate(
        entryId,
        {
          $set: {
            isPublished: true,
            isDrafted: false,
          },
        },
        {
          new: true,
        },
      );

      if (!(published_entry && published_entry.isPublished)) {
        throw new NotFoundException('Entry Not Updated');
      }

      return published_entry;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Somethin Went Wrong');
    }
  }

  async findOne(
    userId: string,
    entryId: string,
  ): Promise<ContentEntryDocument> {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid User ID');
      }
      if (!mongoose.Types.ObjectId.isValid(entryId)) {
        throw new BadRequestException('Invalid Entry ID');
      }

      const entry = await this.contentEntryModel.findOne({
        _id: entryId,
        owner: userId,
      });

      if (!entry) {
        throw new NotFoundException('Entry Not Found or Unauthorized Access');
      }

      return entry;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Something Went Wrong');
    }
  }

  async update(
    userId: string,
    entryId: string,
    updateContentEntryDto: UpdateContentEntryDto,
  ): Promise<ContentEntryDocument> {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid User ID');
      }
      if (!mongoose.Types.ObjectId.isValid(entryId)) {
        throw new BadRequestException('Invalid Entry ID');
      }
      const valid_user_entry = await this.contentEntryModel.findOne({
        _id: entryId,
        owner: userId,
      });
      if (!valid_user_entry) {
        throw new NotFoundException('Entry Not Found / User Not Authorized');
      }
      const updated_entry = await this.contentEntryModel.findByIdAndUpdate(
        entryId,
        {
          $set: {
            ...updateContentEntryDto.values,
            isDrafted: true,
            isPublished: false,
          },
        },
        {
          new: true,
        },
      );
      if (!updated_entry) {
        throw new NotFoundException('Entry Not Found');
      }

      return updated_entry;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Somethin Went Wrong');
    }
  }

  async remove(
    userId: string,
    entryId: string,
  ): Promise<Record<string, string>> {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid User ID');
      }
      if (!mongoose.Types.ObjectId.isValid(entryId)) {
        throw new BadRequestException('Invalid Entry ID');
      }

      const entry = await this.contentEntryModel.findOneAndDelete({
        _id: entryId,
        owner: userId,
      });

      if (!entry) {
        throw new NotFoundException('Entry Not Found or Unauthorized Access');
      }

      return { message: 'Entry deleted successfully' };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Something Went Wrong');
    }
  }
}
