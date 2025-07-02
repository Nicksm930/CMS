import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot(
      `mongodb+srv://admin:admin@clusterpmt.mmiwslk.mongodb.net/cms`,
    ),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [MongooseModule],
})
export class AppModule {}
