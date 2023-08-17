import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import fg from 'fast-glob';
import fs from 'fs';
import yaml from 'js-yaml';

interface Blog {
  title: string;
  tags: string[];
  private: boolean;
  featured: boolean;
  markdown: string;
  subtitle: string;
}

@Injectable()
export class BlogsService {
  private readonly logger = new Logger(BlogsService.name);
  constructor(private readonly prismaService: PrismaService) {
    //
  }

  private createFixtures = async () => {
    // read all yaml files in fixture/blogs
    // and create/upsert a Blog Entitiy in db
    const files = await fg(['./fixtures/blogs/**/*.yaml']);
    const promises: Promise<any>[] = [];
    for (const file of files) {
      const blog = fs.readFileSync(file, 'utf8');
      try {
        const data = yaml.load(blog) as Blog;
        const markdownFile = await fs.readFileSync(
          `./fixtures/blogs/markdown/${data.markdown}`,
          'ascii',
        );
        const savedBlog = await this.prismaService.blog.upsert({
          where: {
            title: data.title,
          },
          create: {
            ...data,
            markdown: markdownFile,
          },
          update: {
            ...data,
            markdown: markdownFile,
          },
        });
        this.logger.debug({ savedBlog });
      } catch (e) {
        this.logger.error({ e }, 'createFixtures() => ERROR: ');
      }
    }
  };

  onModuleInit() {
    this.createFixtures();
  }

  public getAllBlogs = async () => {
    return await this.prismaService.blog.findMany({
      where: { private: false },
    });
  };

  public getBlogByIdOrSlug = async ({ slugOrId }: { slugOrId: string }) => {
    const maybeBlog = this.prismaService.blog.findFirst({
      where: { id: slugOrId, OR: [{ slug: slugOrId }] },
    });
    if (!maybeBlog) {
      throw new NotFoundException();
    }
    return maybeBlog;
  };
}
