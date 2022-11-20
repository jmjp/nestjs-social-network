import { Module } from '@nestjs/common';
import { PostService } from './services/post.service';
import { PostController } from './controllers/post/post.controller';
import { SharedModule } from 'src/shared/shared.module';
import { CommentsController } from './controllers/comments/comments.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [SharedModule, UploadModule],
  exports: [PostModule, PostService],
  providers: [PostService],
  controllers: [PostController, CommentsController]
})
export class PostModule {}
