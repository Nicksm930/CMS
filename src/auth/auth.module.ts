import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { HashingProvider } from './provider/hashing.provider';
import { BcryptProvider } from './provider/bcrypt.provider';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: 'nikhilmore',
      signOptions: {
        expiresIn: '3d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,{
    provide:HashingProvider,
    useClass:BcryptProvider
  }],
})
export class AuthModule {}
