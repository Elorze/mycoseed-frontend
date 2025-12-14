// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxt/icon'
  ],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3001'
    }
  },
  // 配置UI主题
  ui: {
    global: true,
    icons: ['heroicons']
  }
})
