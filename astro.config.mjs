// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

import mdx from '@astrojs/mdx';

const NOINDEX_PATHS = ['/privacy/', '/terms/', '/disclaimer/', '/editorial-policy/', '/search/'];

// https://astro.build/config
export default defineConfig({
    site: 'https://bullorbear.in',
    adapter: cloudflare(),
    session: false,
    integrations: [
        react(),
        sitemap({
            filter: (page) => !NOINDEX_PATHS.some((path) => new URL(page).pathname === path),
            serialize: (item) => {
                const pathname = new URL(item.url).pathname;
                if (pathname === '/') {
                    return { ...item, changefreq: 'daily', priority: 1.0 };
                }
                if (/^\/[^/]+\/[^/]+\/$/.test(pathname) && !pathname.startsWith('/calculators/')) {
                    // category/slug article pages
                    return { ...item, changefreq: 'weekly', priority: 0.8 };
                }
                return { ...item, changefreq: 'weekly', priority: 0.6 };
            },
        }),
        mdx(),
    ],
    vite: {
        plugins: [tailwindcss()],
    },
});