import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VisitorsService } from 'src/visitors/visitors.service';

@Injectable()
export class EmailsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly visitorService: VisitorsService,
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

    return await this.prismaService.contactMessage.create({
      data: {
        text: message,
        visitorId: visitor.id,
      },
    });
  };
}
