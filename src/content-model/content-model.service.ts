import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateContentModelDto } from './dto/create-content-model.dto';
import { UpdateContentModelDto } from './dto/update-content-model.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  ContentModel,
  ContentModelDocument,
} from './entities/content-model.entity';
import mongoose, { Model } from 'mongoose';
import {
  ContentField,
  ContentFieldDocument,
} from 'src/content-field/entities/content-field.entity';
import { log } from 'console';
import { AssignUserDto } from './dto/assign-user.dto';
import { RevokeUserDto } from './dto/revoke-user.dto';
import { User, UserDocument } from 'src/users/entities/user.entity';

@Injectable()
export class ContentModelService {
  constructor(
    @InjectModel(ContentModel.name)
    private readonly contentModel: Model<ContentModelDocument>,
    @InjectModel(ContentField.name)
    private readonly contentFieldModel: Model<ContentFieldDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(
    id: string,
    createContentModelDto: CreateContentModelDto,
  ): Promise<ContentModelDocument> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid User ID');
      }
      // console.log(createContentModelDto);

      const contentModel = await this.contentModel.create({
        ...createContentModelDto,
        owner: id,
      });
      // console.log(contentModel);

      if (!contentModel) {
        throw new ConflictException('Either Model already Exsist');
      }
      return contentModel;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findAll(): Promise<ContentModelDocument[] | null> {
    // const models=await this.contentModel.find();
    const models = await this.contentModel.aggregate([
      {
        $lookup: {
          from: 'contentfields',
          localField: 'fields',
          foreignField: '_id',
          as: 'ModelFields',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'owner',
          foreignField: '_id',
          as: 'UserDetails',
        },
      },
    ]);
    if (!models.length) {
      throw new NotFoundException('No Models Found');
    }
    return models;
  }

  async findOne(id: string): Promise<ContentModelDocument> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid Model ID');
      }
      const model = await this.contentModel.findById(id).populate('fields');
      if (!model) {
        throw new NotFoundException('Model Not Found or Create a New Model');
      }
      return model;
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

  async findOneByName(name: string): Promise<ContentModelDocument> {
    try {
      // console.log(name);

      const model = await this.contentModel.findOne({ modelName: name });

      // const model = await this.contentModel.aggregate([
      //   {
      //     $match: {
      //       modelName: name,
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: 'contentfields',
      //       localField: 'fields',
      //       foreignField: '_id',
      //       as: 'ModelFields',
      //     },
      //   },
      //   {
      //     $unwind: '$ModelFields',
      //   },
      //   {
      //     $project: {
      //       modelName: 1,
      //       'ModelFields._id': 1,
      //       'ModelFields.uid': 1,
      //       'ModelFields.displayName': 1,
      //       'ModelFields.dataType': 1,
      //       'ModelFields.isMandatory': 1,
      //       'ModelFields.isMultiple': 1,
      //     },
      //   },
      // ]);
      // console.log(model);
      if (!model) {
        throw new NotFoundException('Model Not Found or Created ');
      }

      return model;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async assignUser(
    model_id,
    assignUserDto: AssignUserDto,
  ): Promise<ContentModelDocument> {
    try {
      if (!mongoose.Types.ObjectId.isValid(model_id)) {
        throw new BadRequestException('Invalid Model ID');
      }
      const { assigned_users } = assignUserDto;
      if (!assigned_users.length) {
        throw new BadRequestException('No User Assigned');
      }

      const updated_model = await this.contentModel.findByIdAndUpdate(
        model_id,
        {
          $addToSet: {
            assigned_users: {
              $each: assigned_users,
            },
          },
        },
        {
          new: true,
        },
      );
      if (!updated_model) {
        throw new NotFoundException('Model Not Found');
      }

      const updated_user=await this.userModel.updateMany(
        {
          _id:{
            $in:assigned_users
          }
        },
        {
          $addToSet:{
            assigned_models:model_id
          }
        },
        {
          new:true
        }
      )
      if (updated_user.matchedCount === 0) {
        throw new NotFoundException('User Not Found');
      }

      return updated_model;
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

  async update(
    id: string,
    updateContentModelDto: UpdateContentModelDto,
  ): Promise<ContentModelDocument> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid ID');
      }

      const isModelExists = await this.findOne(id);
      if (!isModelExists) {
        throw new NotFoundException('Model Not Found');
      }

      const updated_model = await this.contentModel.findByIdAndUpdate(
        id,
        {
          $set: updateContentModelDto,
        },
        {
          new: true,
        },
      );
      if (!updated_model) {
        throw new NotFoundException('Model Not Updated');
      }

      return updated_model;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async remove(id: string): Promise<Record<string, string>> {
    try {
      const model = await this.findOne(id);
      const fields = model.fields;

      const isDeleted = await this.contentModel.findByIdAndDelete({ _id: id });
      if (!isDeleted) {
        throw new NotFoundException('Model Not Found or Already Deleted');
      }

      fields.map(async (field) => {
        await this.contentFieldModel.findByIdAndDelete({ _id: field._id });
      });

      return {
        message: 'Model Deleted Successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }
  async revokeUser(
    model_id: string,
    revokeUserDto: RevokeUserDto,
  ): Promise<ContentModelDocument> {
    try {
      if (!mongoose.Types.ObjectId.isValid(model_id)) {
        throw new BadRequestException('Invalid Model ID');
      }

      const { revoked_users } = revokeUserDto;
      if (!revoked_users.length) {
        throw new BadRequestException('No User Selected to be Revoked');
      }

      const updated_model = await this.contentModel.findByIdAndUpdate(
        model_id,
        {
          $pull: {
            assigned_users: {
              $in: revoked_users,
            },
          },
        },
        {
          new: true,
        },
      );
      if (!updated_model) {
        throw new NotFoundException('Unable to Update or Model Not Found');
      }

      const updated_user=await this.userModel.updateMany(
        {
          _id:{
            $in:revoked_users
          }
        },
        {
          $pull:{
            assigned_models:model_id
          }
        }
      )

      if(updated_user.matchedCount == 0){
        throw new NotFoundException("User Not Found")
      }

      return updated_model;
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
}
