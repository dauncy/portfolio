import { Injectable } from '@nestjs/common';
import { Visitor } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VisitorsService {
  constructor(private readonly prismaService: PrismaService) {}

  public findOrCreateVisitor = async ({
    name,
    email,
  }: {
    name: string;
    email: string;
  }): Promise<Visitor> => {
    const found = await this.prismaService.visitor.findFirst({
      where: { email },
    });

    if (found) {
      return found;
    }

    return await this.prismaService.visitor.create({
      data: { name, email },
    });
  };
}
