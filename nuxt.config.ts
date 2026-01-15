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
      // 开发环境默认使用本地后端，生产环境使用云端
      apiUrl: process.env.NUXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://mycoseed-backend.fly.dev'),
      amapApiKey: process.env.AMAP_API_KEY || 'YOUR_AMAP_API_KEY_HERE'
    }
  },
  // 配置UI主题
  ui: {
    global: true,
    icons: ['heroicons']
  }
})
