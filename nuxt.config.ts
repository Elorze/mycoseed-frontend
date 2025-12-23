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
      // 高德地图API Key（占位符，需要替换为实际的API Key）
      amapApiKey: process.env.AMAP_API_KEY || 'YOUR_AMAP_API_KEY_HERE'
    }
  },
  // 配置UI主题
  ui: {
    global: true,
    icons: ['heroicons']
  }
})
