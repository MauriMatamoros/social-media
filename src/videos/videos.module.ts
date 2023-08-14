import { Module } from '@nestjs/common';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [VideosController],
  providers: [VideosService],
  imports: [PrismaModule],
})
export class VideosModule {}
