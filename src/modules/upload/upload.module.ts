import { Module } from '@nestjs/common';
import { R2Service } from './services/r2.service';
import { UploadController } from './controllers/upload.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [R2Service],
  controllers: [UploadController],
  exports: [R2Service,UploadModule]
})
export class UploadModule {}
