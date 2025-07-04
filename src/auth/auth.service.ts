import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateRegisterDto } from './dto/register.dto';
import { CreateLoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserResponse } from './dto/response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jswtService: JwtService,
  ) {}

  async register(createRegisterDto: CreateRegisterDto): Promise<UserResponse> {
    try {
      const isUserPresent = await this.userService.findOneByEmail(
        createRegisterDto.email,
      );
      if (isUserPresent) {
        throw new ConflictException('Email Already Exists');
      }

      const hashedPassword = await bcrypt.hash(createRegisterDto.password, 10);
      const user = await this.userService.create({
        ...createRegisterDto,
        password: hashedPassword,
      });
      const payload = {
        _id: user._id,
        email: user.email,
        user_role: user.user_role,
      };
      const access_token = this.jswtService.sign(payload);

      const response = {
        user: user,
        token: access_token,
      };

      return response;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async login(createLoginDto: CreateLoginDto): Promise<UserResponse> {
    const { email, password } = createLoginDto;
    try {
      const user = await this.userService.findOneByEmail(email);
      if (!user) {
        throw new UnauthorizedException('User is Not Registered');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('InValid Password');
      }

      const payload = {
        _id: user._id,
        email: user.email,
        user_role: user.user_role,
      };

      const access_token = this.jswtService.sign(payload);
      const response = {
        user: user,
        token: access_token,
      };
      return response;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
        throw new InternalServerErrorException();
    }
  }
}
