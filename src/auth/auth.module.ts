import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { HashingProvider } from './provider/hashing.provider';
import { BcryptProvider } from './provider/bcrypt.provider';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import authConfig from './config/auth.config';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(authConfig)],
      inject: [authConfig.KEY],
      useFactory: (config: ConfigType<typeof authConfig>) => ({
        secret: config.jwtSecret,
        signOptions: {
          expiresIn: config.expiresIn,
          audience: config.audience,
          issuer: config.issuer,
        },
      }),
    })
  ],
  controllers: [AuthController],
  providers: [AuthService,{
    provide:HashingProvider,
    useClass:BcryptProvider
  }],
})
export class AuthModule {}
