// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    'shadcn-nuxt'
  ],
  runtimeConfig: {
    public: {
      deepgramApiKey: process.env.DEEPGRAM_API_KEY,
      pineconeApiKey: process.env.PINECONE_API_KEY,
      pineconeEnvironment: process.env.PINECONE_ENVIRONMENT,
      pineconeIndex: process.env.PINECONE_INDEX,
      openaiApiKey: process.env.OPENAI_API_KEY,
      pineconeHost: process.env.PINECONE_HOST,
      websocket: process.env.WEBSOCKET_URL
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
       allowedHosts:['iocod.hostcarts.qa']
    }
  }
})
