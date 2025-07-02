import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateContentFieldDto } from './dto/create-content-field.dto';
import { UpdateContentFieldDto } from './dto/update-content-field.dto';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ContentField, ContentFieldDocument } from './entities/content-field.entity';
import { ContentModel, ContentModelDocument } from 'src/content-model/entities/content-model.entity';

@Injectable()
export class ContentFieldService {

  constructor(
    @InjectModel(ContentField.name) private readonly contentFieldModel:Model<ContentFieldDocument>,
    @InjectModel(ContentModel.name) private readonly contentModel:Model<ContentModelDocument>
  ){}

  async create(id:string,createContentFieldDto: CreateContentFieldDto):Promise<ContentFieldDocument> {
    try {
      if(!mongoose.Types.ObjectId.isValid(id)){
        throw new BadRequestException("Invalid Model ID")
      }  

      const contentField=await this.contentFieldModel.create({
        ...createContentFieldDto,
        model:id
      })

      await this.contentModel.findByIdAndUpdate(id,{
        $push:{
          fields:contentField._id
        }
      })

      return contentField
    } catch (error) {
      throw new InternalServerErrorException("Something went wrong");
    }
  }

  findAll() {
    return `This action returns all contentField`;
  }

  findOne(id: number) {
    return `This action returns a #${id} contentField`;
  }

  update(id: number, updateContentFieldDto: UpdateContentFieldDto) {
    return `This action updates a #${id} contentField`;
  }

  remove(id: number) {
    return `This action removes a #${id} contentField`;
  }
}
