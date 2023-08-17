import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from 'src/auth/guards/apikey.guard';
import { BlogsService } from './blogs.service';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get('/')
  async getAllBlogs() {
    return await this.blogsService.getAllBlogs();
  }

  @Get(':id')
  async getBlogByIdOrSlug(@Param('id') id: string) {
    return await this.blogsService.getBlogByIdOrSlug({ slugOrId: id });
  }
}
