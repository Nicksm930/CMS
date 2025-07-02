import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ContentModelModule } from './content-model/content-model.module';
import { ContentFieldModule } from './content-field/content-field.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot(
      `mongodb+srv://admin:admin@clusterpmt.mmiwslk.mongodb.net/cms`,
    ),
    AuthModule,
    ContentModelModule,
    ContentFieldModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [MongooseModule],
})
export class AppModule {}
