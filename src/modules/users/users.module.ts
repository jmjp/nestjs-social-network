import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { FirebaseService } from '../../shared/services/firebase/firebase.service';
import { UsersController } from './controllers/all/users.controller';
import { MeController } from './controllers/me/me.controller';
import { FollowController } from './controllers/follow/follow.controller';
import { PostModule } from '../post/post.module';

@Module({
  controllers: [UsersController, MeController, FollowController],
  imports: [SharedModule, PostModule],
  providers: [FirebaseService]
})
export class UsersModule {}
