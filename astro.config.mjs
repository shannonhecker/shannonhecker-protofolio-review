// @ts-check
import { defineConfig } from 'astro/config';

// DECISION: Astro over Next. The page is one static document with a few
// islands of script, so Astro ships no framework runtime and first paint is
// HTML + CSS only. The brief named Astro 5; 7 is current stable and the
// static-output model is identical.
export default defineConfig({
  site: 'https://shannonhecker.com',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'always' },
  image: { responsiveStyles: false },
});
