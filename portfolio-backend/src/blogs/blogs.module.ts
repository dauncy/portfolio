import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';

@Module({
  imports: [PrismaModule],
  providers: [BlogsService],
  controllers: [BlogsController],
  exports: [],
})
export class BlogsModule {}
