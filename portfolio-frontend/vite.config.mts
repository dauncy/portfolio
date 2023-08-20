import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { resolve } from 'path';
import tailwindcss from 'tailwindcss';
import { sanitizeDate, currentYear }from './src/utils/date.utils';
import { blogsService } from './src/services/blogs.service';
import fetch from "node-fetch";
import fs from "fs";
import { fileURLToPath } from 'url'

// @ts-ignore
export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  const pageData = {
    lastUpdated: sanitizeDate(new Date()),
    copywriteYear: currentYear(),
  };

  const res = await fetch(`http://localhost:3000/blogs`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  const allBlogs: any[] = await res.json() as any[];


  const pages: any[] = [
    {
      filename: `index.html`,
      template: `pages/index.html`,
      injectOptions: {
        data: pageData,
      }
    },
    {
      filename: `/blogs/index.html`,
      template: `pages/blogs/index.html`,
      injectOptions: {
        data: { blogs: allBlogs },
      }
    }
  ];
  // const rollupInput = {};

  // for (const blog of allBlogs) {
  //   const blogTitle = blog.title;
  //   const slug: string  = blog.slug;
  //   const template = fs.readFileSync(`${__dirname}/pages/blogs/id.html`);
  //   fs.writeFileSync(`${__dirname}/pages/blogs/auto/${slug}.html`, template);
  //   pages.push({
  //     filename: `blog/${slug}.html`,
  //     template: `${__dirname}/pages/blogs/generated/${slug}.html`,
  //     injectOptions: {
  //       data: blog,
  //     }
  //   });

  //   rollupInput[`${slug}`] = `${__dirname}/blog/${slug}.html`
  // }
  return {
    plugins: [
      tailwindcss(),
      createHtmlPlugin({
        minify: false,
        pages,
      }),
    ],
    define: {
      BACKEND_URL: JSON.stringify(env.BACKEND_URL),
      VISITOR_API_KEY: JSON.stringify(env.VISITOR_API_KEY),
    },
    server: {
      host: 'localhost',
      port: 4080,
    },
    build: {
      base: '.',
      sourcemap: true,
      chunkSizeWarningLimit: 1024,
      rollupOptions: {
        input: {
          // ...rollupInput,
          index: fileURLToPath(new URL('./pages/index.html', import.meta.url)),
          blog: fileURLToPath(new URL('./pages/blogs/index.html', import.meta.url)),
        },
      },
    },
    esbuild: {
      treeShaking: true,
      supported: {},
      minify: mode !== 'development',
    },
  };
})
