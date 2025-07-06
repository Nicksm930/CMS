import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateRegisterDto } from './dto/register.dto';
import { CreateLoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserResponse } from './dto/response.dto';
import { HashingProvider } from './provider/hashing.provider';
import { ConfigType } from '@nestjs/config';
import authConfig from './config/auth.config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY)
    private readonly authConfiguration:ConfigType<typeof authConfig>,
    private readonly userService: UsersService,
    private readonly jswtService: JwtService,
    private readonly hashingProvider: HashingProvider,
  ) {}

  async register(createRegisterDto: CreateRegisterDto): Promise<UserResponse> {
    try {
      const isUserPresent = await this.userService.findOneByEmail(
        createRegisterDto.email,
      );
      if (isUserPresent) {
        throw new ConflictException('Email Already Exists');
      }

      const hashedPassword = await this.hashingProvider.hashPassword(createRegisterDto.password)
      const user = await this.userService.create({
        ...createRegisterDto,
        password: hashedPassword,
      });
      const payload = {
        _id: user._id,
        email: user.email,
        user_role: user.user_role,
      };
      const access_token =await this.jswtService.signAsync(payload,{
       secret:this.authConfiguration.jwtSecret,
       expiresIn:this.authConfiguration.expiresIn,
       audience:this.authConfiguration.audience,
       issuer:this.authConfiguration.issuer
      });

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
      const isPasswordValid = await this.hashingProvider.comparePassword(password,user.password)
      if (!isPasswordValid) {
        throw new UnauthorizedException('InValid Password');
      }

      const payload = {
        _id: user._id,
        email: user.email,
        user_role: user.user_role,
      };

      const access_token = await this.jswtService.signAsync(payload, {
        secret: this.authConfiguration.jwtSecret,
        expiresIn: this.authConfiguration.expiresIn,
        audience: this.authConfiguration.audience,
        issuer: this.authConfiguration.issuer,
      });
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
