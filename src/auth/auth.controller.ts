  import { Body, Controller, Post } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { CreateRegisterDto } from './dto/register.dto';
  import { UserResponse } from './dto/response.dto';
  import { CreateLoginDto } from './dto/login.dto';

  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(
      @Body() createRegisterDto: CreateRegisterDto,
    ): Promise<UserResponse> {
      return this.authService.register(createRegisterDto);
    }

    @Post('login')
    login(@Body() createLoginDto: CreateLoginDto): Promise<UserResponse> {
      return this.authService.login(createLoginDto);
    }
  }
