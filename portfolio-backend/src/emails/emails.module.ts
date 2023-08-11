import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { VisitorsModule } from 'src/visitors/visitors.module';
import { VisitorsService } from 'src/visitors/visitors.service';
import { EmailsController } from './email.controller';
import { EmailsService } from './emails.service';

@Module({
  imports: [PrismaModule, VisitorsModule],
  providers: [EmailsService, VisitorsService],
  controllers: [EmailsController],
})
export class EmailsModule {}
