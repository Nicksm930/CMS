import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name) private readonly userModel:Model<UserDocument>
  ){}

  async create(createUserDto: CreateUserDto):Promise<UserDocument> {
    const user=await this.userModel.create(createUserDto)
    return user;
  }

  async findAll():Promise<UserDocument[]> {
    try {
      const users = await this.userModel.find();
      if(!users.length){
        throw new NotFoundException("No Users Available")  
      }
      return users;
    } catch (error) {
      if(error instanceof NotFoundException){
        throw error
      }
      throw new InternalServerErrorException("Something went wrong")
    }

    
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findOneByEmail(email:string):Promise<UserDocument | null>{
    const user=await this.userModel.findOne({email:email});
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
