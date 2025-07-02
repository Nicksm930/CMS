import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateContentModelDto } from './dto/create-content-model.dto';
import { UpdateContentModelDto } from './dto/update-content-model.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ContentModel, ContentModelDocument } from './entities/content-model.entity';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class ContentModelService {

  constructor(
    @InjectModel(ContentModel.name) private readonly contentModel:Model<ContentModelDocument>
  ){}

  async create(id:string,createContentModelDto: CreateContentModelDto):Promise<ContentModelDocument> {
    try {
      if(!mongoose.Types.ObjectId.isValid(id)){
        throw new BadRequestException("Invalid User ID")
      }

      const contentModel=await this.contentModel.create({
        ...createContentModelDto,
        owner:id
      })
      return contentModel;
    } catch (error) {
      if(error instanceof BadRequestException){
        throw error;
      }
      throw new InternalServerErrorException("Something went wrong");
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
    if(!models.length){
      throw new NotFoundException("No Models Found")
    }
    return models;
  }

  findOne(id: number) {
    return `This action returns a #${id} contentModel`;
  }

  update(id: number, updateContentModelDto: UpdateContentModelDto) {
    return `This action updates a #${id} contentModel`;
  }

  remove(id: number) {
    return `This action removes a #${id} contentModel`;
  }
}
