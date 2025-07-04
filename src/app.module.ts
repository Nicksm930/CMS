import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ContentModelModule } from './content-model/content-model.module';
import { ContentFieldModule } from './content-field/content-field.module';
import { ContentEntryModule } from './content-entry/content-entry.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot(
      `mongodb+srv://admin:admin@clusterpmt.mmiwslk.mongodb.net/cms`,
    ),
    ConfigModule.forRoot(
      {
        isGlobal:true,
        envFilePath:'.env'
      }
    ),
    AuthModule,
    ContentModelModule,
    ContentFieldModule,
    ContentEntryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [MongooseModule],
})
export class AppModule {}
