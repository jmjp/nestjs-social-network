import { Module } from '@nestjs/common';
import { FirebaseService } from './services/firebase/firebase.service';
import { PrismaService } from './services/prisma/prisma.service';
import { UsersService } from './services/users/users.service';

@Module({
  providers: [PrismaService, UsersService, FirebaseService],
  exports: [
    UsersService,
    PrismaService,
    FirebaseService
  ]
})
export class SharedModule {}
