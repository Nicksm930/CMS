import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const user = await this.userModel.create(createUserDto);
    return user;
  }

  async findAll(): Promise<UserDocument[]> {
    try {
      const users = await this.userModel.find();
      if (!users.length) {
        throw new NotFoundException('No Users Available');
      }
      return users;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findOne(id: string): Promise<UserDocument> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid User Id');
      }
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new NotFoundException('User Not Found With ID');
      }
      return user;
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

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ email: email });
    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    try {
      const updated_user = await this.userModel.findByIdAndUpdate(
        id,
        {
          $set: updateUserDto,
        },
        {
          new: true,
        },
      );

      if (!updated_user) {
        throw new NotFoundException('User Not Found or Not Updated');
      }
      return updated_user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Somenthing Went Wrong');
    }
  }

  async remove(id: string): Promise<Record<string, string>> {
    try {
      const isDeleted = await this.userModel.findByIdAndDelete({ _id: id });
      if (!isDeleted) {
        throw new BadRequestException('User Not Found or Already Deleted');
      }
      return {
        message: 'User Deleted Successfully',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
