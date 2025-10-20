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
      // 这里放一些公共配置
    }
  },
  // 配置UI主题
  ui: {
    global: true,
    icons: ['heroicons']
  }
})
