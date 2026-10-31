import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { sidebar } from './src/data/curriculum.mjs';
import bitbake from './src/grammars/bitbake.mjs';
import dts from './src/grammars/dts.mjs';
import resc from './src/grammars/resc.mjs';

const fonts =
  'https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@500;600;700&family=JetBrains+Mono:wght@400;500&family=Source+Sans+3:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap';

export default defineConfig({
  site: 'https://szyfrowac.github.io',
  // GitHub Pages serves the site from /embedded-linux-notes/ (set by the deploy workflow).
  base: process.env.BASE_PATH || '/',
  // Lesson links in Markdown are relative (../slug/), which needs a consistent trailing slash.
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'AeroCore Systems Guide',
      description: 'Hands-on lessons in embedded Linux, Yocto, Buildroot, kernels and board bring-up.',
      logo: { src: './src/assets/logo.svg', alt: '' },
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/szyfrowac/embedded-linux-notes' }],
      editLink: { baseUrl: 'https://github.com/szyfrowac/embedded-linux-notes/edit/main/' },
      head: [
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' } },
        { tag: 'link', attrs: { rel: 'stylesheet', href: fonts } },
      ],
      customCss: ['./src/styles/flightdeck.css'],
      components: {
        PageTitle: './src/components/overrides/PageTitle.astro',
        Footer: './src/components/overrides/Footer.astro',
        TableOfContents: './src/components/overrides/TableOfContents.astro',
      },
      expressiveCode: {
        themes: ['github-dark-dimmed', 'github-light'],
        shiki: { langs: [bitbake, dts, resc] },
        styleOverrides: { borderRadius: '6px', codeFontFamily: 'var(--sl-font-mono)', uiFontFamily: 'var(--sl-font)' },
      },
      sidebar: sidebar(),
    }),
  ],
});
