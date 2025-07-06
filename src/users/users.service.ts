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
import { UserPagination } from './interfaces/user-pagination.interface';
import { skip } from 'node:test';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const user = await this.userModel.create(createUserDto);
    return user;
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{
    data: UserDocument[];
    metaData: UserPagination;
  }> {
    try {
      const skip = (page - 1) * limit;

      const [users, totalItems] = await Promise.all([
        this.userModel.find().skip(skip).limit(limit),
        this.userModel.countDocuments(),
      ]);

      if (!users.length) {
        throw new NotFoundException('No Users Available');
      }

      const itemsPerPage = limit;
      const currentPage = page;
      const totalNumberOfPages = Math.ceil(totalItems / itemsPerPage);

      const metaData: UserPagination = {
        totalItems,
        itemsPerPage,
        currentPage,
        totalNumberOfPages,
      };

      return {
        data: users,
        metaData,
      };
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
    console.log(user);
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
