import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { UploadModule } from './modules/upload/upload.module';
import { PostModule } from './modules/post/post.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './middlewares/exceptions/exceptions';

@Module({
  imports: [SharedModule, AuthModule, UsersModule, UploadModule, PostModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    }
  ],
})
export class AppModule { }
