<template>
    <div class="w-full max-w-md">
        <PixelCard>
            <template #header>
                <div class="text-center font-pixel text-xl text-mario-red">登录中...</div>
            </template>

            <div class="flex flex-col gap-6 py-4 items-center">
                <div v-if="loading" class="text-center font-vt323 text-lg">
                    正在处理登录...
                </div>
                <div v-if="error" class="text-center font-vt323 text-lg text-mario-red">
                    {{ error }}
                </div>
            </div>
        </PixelCard>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '~/composables/useToast'
import { useUserStore } from '~/stores/user'
import { parseFragment, getSemiUserInfo, syncFromSemi } from '~/utils/api'
import PixelCard from '~/components/pixel/PixelCard.vue'

// #region agent log
if (typeof window !== 'undefined') {
  fetch('http://127.0.0.1:7242/ingest/12fcd2f2-6fd8-4340-8068-b1f6eb08d647', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: 'pages/auth/callback.vue:script-setup',
      message: 'Callback page script setup executed',
      data: { path: window.location.pathname, hash: window.location.hash },
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId: 'A'
    })
  }).catch(() => {})
}
// #endregion

definePageMeta({
  layout: 'unauth'
  // 移除 ssr: false，确保路由在构建时被正确注册
  // 客户端逻辑在 onMounted 中处理，通过 typeof window 检查确保只在客户端执行
})

const router = useRouter()
const toast = useToast()
const userStore = useUserStore()
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/12fcd2f2-6fd8-4340-8068-b1f6eb08d647', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: 'pages/auth/callback.vue:onMounted',
      message: 'onMounted hook executed',
      data: { pathname: window.location.pathname, hash: window.location.hash },
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId: 'A'
    })
  }).catch(() => {})
  // #endregion

  // 确保在客户端执行
  if (typeof window === 'undefined') {
    return
  }

  try {
    // 1. 从 URL fragment 中提取参数
    const hash = window.location.hash
    const params = parseFragment(hash)

    // 2. 提取 access_token
    const accessToken = params.access_token
    if (!accessToken) {
      // 如果没有 access_token，显示错误但不要抛出异常（这样页面可以正常显示）
      error.value = '未找到访问令牌，请重新登录'
      loading.value = false
      
      toast.add({
        title: '登录失败',
        description: '未找到访问令牌，请重新登录',
        color: 'red'
      })
      
      // 3秒后跳转回登录页
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)
      return
    }
    
    // 3. 立即清理地址栏（移除 fragment，不刷新页面）
    window.history.replaceState(
      {}, 
      document.title, 
      window.location.pathname + window.location.search
    )
    
    // 4. 验证 state（防止 CSRF 攻击）
    const savedState = sessionStorage.getItem('oauth_state')
    const receivedState = params.state

    if (!savedState || savedState !== receivedState) {
      error.value = '无效的状态参数，请重新登录'
      loading.value = false
      
      toast.add({
        title: '登录失败',
        description: '无效的状态参数，请重新登录',
        color: 'red'
      })
      
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)
      return
    }

    // 清除 state
    sessionStorage.removeItem('oauth_state')

    // 5. 保存 Semi 的 access_token（存储为 semi_token）
    localStorage.setItem('semi_token', accessToken)
    
    // 6. 获取运行时配置
    const config = useRuntimeConfig()
    const semiApiUrl = config.public.semiApiUrl
    const apiBaseUrl = config.public.apiUrl
    
    // 检查必要的配置
    if (!semiApiUrl || !apiBaseUrl) {
      throw new Error('API 配置不完整，请检查环境变量设置')
    }
    
    // 7. 调用 Semi API 获取用户信息
    const semiUserData = await getSemiUserInfo(accessToken, semiApiUrl)
    
    // 8. 同步用户信息到 Mycoseed
    const syncResult = await syncFromSemi(semiUserData, apiBaseUrl)
    
    if (syncResult.result === 'ok' && syncResult.auth_token) {
      // 9. 保存 mycoseed 的 auth_token
      localStorage.setItem('auth_token', syncResult.auth_token)
      
      // 10. 获取用户信息并设置到 store
      const user = syncResult.user || semiUserData
      const userWithMetadata = {
        ...user,
        isProfileSetup: !!user.name,
        userType: user.userType || 'member'
      }
      userStore.setUser(userWithMetadata)
      
      // 11. 根据用户状态跳转
      if (!user.name) {
        // 新用户，跳转到设置页面
        toast.add({
          title: '注册成功',
          description: '欢迎加入，请完成资料设置',
          color: 'green'
        })
        await router.push('/profile/setup')
      } else {
        // 老用户，跳转到首页
        toast.add({
          title: '登录成功',
          description: '欢迎回来',
          color: 'green'
        })
        await router.push('/')
      }
    } else {
      throw new Error('Failed to sync user')
    }
  } catch (err: any) {
    console.error('OAuth callback error:', err)
    error.value = err.message || '登录失败，请重试'
    loading.value = false
    
    toast.add({
      title: '登录失败',
      description: err.message || '请重试',
      color: 'red'
    })
    
    // 3秒后跳转回登录页
    setTimeout(() => {
      router.push('/auth/login')
    }, 3000)
    }
})
</script>