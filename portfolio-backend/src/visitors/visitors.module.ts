import { Module } from '@nestjs/common';
import { VisitorsService } from './visitors.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [VisitorsService],
})
export class VisitorsModule {}
