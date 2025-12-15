<template>
  <div class="fixed bottom-0 left-0 w-full bg-black text-white border-t-4 border-white z-50 md:hidden">
    <div class="flex justify-around items-center h-16">
      <div 
        v-for="item in navItems" 
        :key="item.path"
        class="flex flex-col items-center justify-center w-full h-full cursor-pointer active:bg-gray-800 transition-colors"
        @click="navigateTo(item.path)"
      >
        <span class="text-xl mb-1">{{ item.icon }}</span>
        <span class="font-pixel text-[10px]">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

const navItems = [
  // 与桌面端 Header 保持一致：任务页作为主要入口
  { label: '广场', path: '/', icon: '🗺️' },
  { label: '任务', path: '/tasks', icon: '📋' },
  { label: '钱包', path: '/wallet', icon: '💰' },
  { label: '我的', path: '/member/1', icon: '👤' }
]

const navigateTo = (path: string) => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/af348509-5d27-4b86-baea-9c27926471bf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: 'debug-session',
      runId: 'nav-structure',
      hypothesisId: 'H1',
      location: 'components/layout/BottomNav.vue:navigateTo',
      message: 'BottomNav navigateTo called',
      data: { path },
      timestamp: Date.now()
    })
  }).catch(() => {})
  // #endregion

  router.push(path)
}
</script>


