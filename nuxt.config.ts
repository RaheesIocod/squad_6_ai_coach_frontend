// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    'shadcn-nuxt'
  ],
  icon: {
    customCollections: [
      {
        prefix: 'my-icon',
        dir: './assets/my-icons'
      },
    ],
  },
  runtimeConfig: {
    public: {
      deepgramApiKey: process.env.DEEPGRAM_API_KEY,
      // pineconeApiKey: process.env.PINECONE_API_KEY,
      // pineconeEnvironment: process.env.PINECONE_ENVIRONMENT,
      // pineconeIndex: process.env.PINECONE_INDEX,
      // openaiApiKey: process.env.OPENAI_API_KEY,
      // pineconeHost: process.env.PINECONE_HOST,
      websocket: process.env.WEBSOCKET_URL,
      apiBaseUrl: process.env.API_BASE_URL || 'http://iocod.hostcarts.qa/api'

    }
  },
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ['iocod.hostcarts.qa']
    },
  }
})
