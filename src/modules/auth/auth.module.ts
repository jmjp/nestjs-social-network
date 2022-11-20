import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { UsersService } from 'src/shared/services/users/users.service';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [UsersService, PrismaService],
  controllers: [AuthController]
})
export class AuthModule {}
