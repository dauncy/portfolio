import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VisitorsService } from 'src/visitors/visitors.service';
import { MailService } from './mailer.service';

@Injectable()
export class EmailsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly visitorService: VisitorsService,
    private readonly mailerService: MailService,
  ) {}

  public createContactMessage = async ({
    message,
    email,
    name,
  }: {
    message: string;
    email: string;
    name: string;
  }) => {
    const visitor = await this.visitorService.findOrCreateVisitor({
      name,
      email,
    });

    const promises: Promise<any>[] = [];

    promises.push(
      this.prismaService.contactMessage.create({
        data: {
          text: message,
          visitorId: visitor.id,
        },
      }),
    );

    promises.push(
      this.mailerService.sendUserConfirmation({
        email,
        text: message,
        name,
      }),
    );

    await Promise.all(promises);
    return { status: 200, data: null };
  };
}
