import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Vercel auto-detects Astro static output (output:'static' -> ./dist).
// SITE_URL is set per-environment; falls back to the Vercel preview placeholder.
const site = process.env.SITE_URL || 'https://startup-factory.vercel.app';

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    tailwind({ applyBaseStyles: false }),
  ],
  build: { inlineStylesheets: 'auto' },
  vite: {
    // Workspace packages (@factory/*) resolve natively via pnpm symlinks + package "exports".
    // Allow Vite to read files from the monorepo root (needed for the dev server; harmless for build).
    server: { fs: { allow: ['..', '../..'] } },
  },
});
