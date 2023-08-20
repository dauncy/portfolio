import { z } from 'zod';
import { loadEnv } from 'vite';

const blogSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  featured: z.boolean(),
  private: z.boolean(),
  tags: z.array(z.string()),
  markdown: z.string(),
  slug: z.string(),
});

type BlogPost = z.infer<typeof blogSchema>;

class BlogsService {
  static instance: BlogsService;
  static getInstance() {
    if (!BlogsService.instance) {
      BlogsService.instance = new BlogsService();
    }

    return BlogsService.instance;
  };

  public getAllBlogPosts = async(mode='development') => {
    const env = loadEnv(mode, process.cwd(), '');
    const { authService } = await import('./auth.service');
    const headers = authService.getDefaultHeaders();
    await fetch
  }
}

export const blogsService = BlogsService.getInstance();
