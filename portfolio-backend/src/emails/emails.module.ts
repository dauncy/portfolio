import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { VisitorsModule } from 'src/visitors/visitors.module';
import { VisitorsService } from 'src/visitors/visitors.service';
import { EmailsController } from './email.controller';
import { EmailsService } from './emails.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mailer.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('mailer.smtpHost'),
          port: 465,
          secure: true,
          auth: {
            user: config.get('mailer.smtpUser'),
            pass: config.get('mailer.smtpPassword'),
          },
        },
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    VisitorsModule,
  ],
  providers: [EmailsService, VisitorsService, MailService],
  controllers: [EmailsController],
})
export class EmailsModule {}
