import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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
      modelFields.map((field: ContentFieldDocument) => {
        const value = userData[field.uid];
        if (!value) {
          if (field.isMandatory) {
            throw new BadRequestException('Field is Mandatory');
          }
          payload = { ...payload, [field.uid]: value };
        }

        payload = { ...payload, [field.uid]: value };
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

  findAll() {
    return `This action returns all contentEntry`;
  }

  findOne(id: number) {
    return `This action returns a #${id} contentEntry`;
  }

  update(id: number, updateContentEntryDto: UpdateContentEntryDto) {
    return `This action updates a #${id} contentEntry`;
  }

  remove(id: number) {
    return `This action removes a #${id} contentEntry`;
  }
}
