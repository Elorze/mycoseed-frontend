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
      amapApiKey: process.env.AMAP_API_KEY || 'YOUR_AMAP_API_KEY_HERE',
      // Semi OAuth2 配置（从环境变量读取，生产环境必须在 Vercel 中配置）
      // 开发环境提供默认值方便本地开发，生产环境必须通过环境变量配置
      semiApiUrl: process.env.NUXT_PUBLIC_SEMI_API_URL || (process.env.NODE_ENV === 'development' ? 'https://semi.fly.dev' : ''),
      semiOAuthUrl: process.env.NUXT_PUBLIC_SEMI_OAUTH_URL || (process.env.NODE_ENV === 'development' ? 'http://www.semi.im' : ''),
      // clientId 不提供默认值，必须通过环境变量配置（安全考虑）
      semiClientId: process.env.NUXT_PUBLIC_SEMI_CLIENT_ID || '',
      semiRedirectUri: process.env.NUXT_PUBLIC_SEMI_REDIRECT_URI || 
        (process.env.NODE_ENV === 'development' 
          ? 'http://localhost:3000/auth/callback'
          : ''),
    }
  },
  // 配置UI主题
  ui: {
    global: true,
    icons: ['heroicons']
  }
})
