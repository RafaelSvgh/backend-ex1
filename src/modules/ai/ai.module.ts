import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import * as multer from 'multer';

@Module({
  imports: [
    MulterModule.register({
      // dest: './uploads', // Carpeta temporal para archivos
      storage: multer.memoryStorage(),
    }),
  ],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
