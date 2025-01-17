// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/content'
  ],

  app: {
    head: {
      title: 'spitkov - Full-Stack Developer',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'full-stack dev - cybersec' },
        { property: 'og:title', content: 'spitkov - Full-Stack Developer' },
        { property: 'og:description', content: 'full-stack dev' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'theme-color', content: '#4ade80' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap' }
      ],
      htmlAttrs: {
        lang: 'en'
      }
    }
  },

  runtimeConfig: {
    public: {
      discordId: '1092100801478004816'
    }
  },

  compatibilityDate: '2025-01-17',

  experimental: {
    payloadExtraction: true,
    renderJsonPayloads: true,
    viewTransition: true,
    componentIslands: true
  },

  nitro: {
    compressPublicAssets: true,
    minify: true
  },

  routeRules: {
    '/': { prerender: true },
    '/portfolio': { prerender: true },
    '/tools': { prerender: true },
    '/blog': { prerender: true },
    '/fun': { prerender: true },
    '/api/**': { prerender: false }
  }
})