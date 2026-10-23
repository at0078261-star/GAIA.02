import { defineConfig } from 'astro/config';

// GitHub Pages : définissez SITE et BASE_PATH au moment du build, par exemple
//   SITE=https://mon-compte.github.io BASE_PATH=/gaia npm run build
// En local (npm run dev), rien à configurer.
export default defineConfig({
  site: process.env.SITE || undefined,
  base: process.env.BASE_PATH || '/',
});
