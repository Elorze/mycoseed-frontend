export default defineEventHandler((event) => {
  const env = process.env
  return {
    ok: true,
    vercelEnv: env.VERCEL_ENV || '',
    vercelSha: env.VERCEL_GIT_COMMIT_SHA || '',
    vercelBranch: env.VERCEL_GIT_COMMIT_REF || '',
    nodeEnv: env.NODE_ENV || '',
    // 不返回任何敏感信息（不含 token / key）
    hasSemiClientId: !!env.NUXT_PUBLIC_SEMI_CLIENT_ID,
    hasSemiRedirectUri: !!env.NUXT_PUBLIC_SEMI_REDIRECT_URI,
    hasSemiOAuthUrl: !!env.NUXT_PUBLIC_SEMI_OAUTH_URL,
    hasSemiApiUrl: !!env.NUXT_PUBLIC_SEMI_API_URL,
    buildTime: new Date().toISOString()
  }
})


