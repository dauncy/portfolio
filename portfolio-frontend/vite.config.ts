import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
//@ts-ignore
import { resolve } from 'path';
import tailwindcss from 'tailwindcss';
import { sanitizeDate, currentYear }from './src/utils/date.utils'

// @ts-ignore
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const pageData = {
    lastUpdated: sanitizeDate(new Date()),
    copywriteYear: currentYear(),
  };

  const pages = [
    {
      filename: 'index.html',
      template: 'index.html',
      injectOptions: {
        data: pageData,
      }
    }
  ];

  return {
    plugins: [
      tailwindcss(),
      createHtmlPlugin({
        pages: pages,
      }),
    ],
    define: {
      BACKEND_URL: JSON.stringify(env.BACKEND_URL),
      VISITOR_API_KEY: JSON.stringify(env.VISITOR_API_KEY),
    },
    base: '',
    server: {
      host: 'localhost',
      port: 4080,
    },
    build: {
      base: '',
      // sourcemap: true,
      chunkSizeWarningLimit: 1024,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
      },
    },
    esbuild: {
      treeShaking: true,
      supported: {},
      minify: mode !== 'development',
    },
    resolve: {
      alias: {},
    },
  };
})

function dateStr(arg0: number) {
  throw new Error('Function not implemented.');
}
