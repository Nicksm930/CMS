  import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { CreateRegisterDto } from './dto/register.dto';
  import { UserResponse } from './dto/response.dto';
  import { CreateLoginDto } from './dto/login.dto';
  import { Role } from './decorators/role.decorator';
  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Role('public')
    @Post('register')
    register(
      @Body() createRegisterDto: CreateRegisterDto,
    ): Promise<UserResponse> {
      return this.authService.register(createRegisterDto);
    }

    @Role('public')
    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() createLoginDto: CreateLoginDto): Promise<UserResponse> {
      return this.authService.login(createLoginDto);
    }
  }
