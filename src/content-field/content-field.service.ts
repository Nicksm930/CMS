import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateContentFieldDto } from './dto/create-content-field.dto';
import { UpdateContentFieldDto } from './dto/update-content-field.dto';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  ContentField,
  ContentFieldDocument,
} from './entities/content-field.entity';
import {
  ContentModel,
  ContentModelDocument,
} from 'src/content-model/entities/content-model.entity';
import { AssignUserDto } from 'src/content-model/dto/assign-user.dto';

@Injectable()
export class ContentFieldService {
  constructor(
    @InjectModel(ContentField.name)
    private readonly contentFieldModel: Model<ContentFieldDocument>,
    @InjectModel(ContentModel.name)
    private readonly contentModel: Model<ContentModelDocument>,
  ) {}

  async create(
    id: string,
    user_id:string,
    createContentFieldDto: CreateContentFieldDto,
  ): Promise<ContentFieldDocument> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid Model ID');
      }
      if (!mongoose.Types.ObjectId.isValid(user_id)) {
        throw new BadRequestException('Invalid User ID');
      }

      const isModelExists = await this.contentModel.findById(id);
      if (!isModelExists) {
        throw new NotFoundException(
          'Model Does Not Exists or Deleted . Create a New One',
        );
      }
      const isModelOwner=isModelExists.owner.toString() === user_id
      if(!isModelOwner){
        throw new UnauthorizedException("You are Not the Owner of this Model")
      }
      const contentField = await this.contentFieldModel.create({
        ...createContentFieldDto,
        model: id,
      });

      await this.contentModel.findByIdAndUpdate(id, {
        $push: {
          fields: contentField._id,
        },
      });

      return contentField;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('Field UID must be unique');
      }
      if (error.name === 'ValidationError') {
        throw new BadRequestException('Field validation failed');
      }
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findAllByModelID(id: string): Promise<ContentFieldDocument[]> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid ID');
      }

      const fields = await this.contentFieldModel.find({ model: id });
      if (!fields.length) {
        throw new NotFoundException(
          'Model Does Not Contains Feild or Does Not Exists',
        );
      }

      return fields;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findOne(id: string): Promise<ContentFieldDocument> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid ID');
      }
      const feild = await this.contentFieldModel.findById(id);
      if (!feild) {
        throw new NotFoundException('No field Found or Maybe Deleted');
      }
      return feild;
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
    id: string,
    updateContentFieldDto: UpdateContentFieldDto,
  ): Promise<ContentFieldDocument> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid Id');
      }

      const updated_field = await this.contentFieldModel.findByIdAndUpdate(
        id,
        {
          $set: updateContentFieldDto,
        },
        {
          new: true,
        },
      );
      if (!updated_field) {
        throw new NotFoundException('Feild Not found or Maybe Deleted');
      }

      return updated_field;
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

  async remove(id: string): Promise<Record<string, string>> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid ID');
      }
      const field = await this.contentFieldModel.findById(id);
      const isDeleted = await this.contentFieldModel.findByIdAndDelete({
        _id: id,
      });
      if (!isDeleted) {
        throw new NotFoundException('Field Not Found or Alraedy Deleted');
      }
      const updated_model = await this.contentModel.findByIdAndUpdate(field?.model, {
        $pull: {
          fields: id,
        },
      });
      if (!updated_model) {
        throw new NotFoundException('Model Not Found or Already Deleted');
      }

      return {
        message: 'Field Deleted Successfully',
      };
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
