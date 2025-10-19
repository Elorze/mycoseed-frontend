<script setup>
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
const user = computed(() => userStore.user)

// 检查用户是否已登录
onMounted(async () => {
  await userStore.getUser()
  if (!user.value) {
    await navigateTo('/login')
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 主要内容区域 -->
    <div class="container mx-auto px-4 py-8">
      <!-- Profile 组件 -->
      <Profile v-if="user" :user="user" />
      
      <!-- 未登录提示 -->
      <div v-else class="min-h-screen flex items-center justify-center">
        <div class="text-center">
          <h1 class="text-2xl font-bold mb-4">欢迎来到 Activity</h1>
          <p class="text-gray-600 mb-6">请先登录以查看活动</p>
          <button 
            @click="navigateTo('/login')"
            class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            立即登录
          </button>
        </div>
      </div>
    </div>
    
    <!-- 活动入口悬浮按钮 -->
    <div
      v-if="user"
      @click="navigateTo('/activities')"
      class="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 z-50 group cursor-pointer"
      title="查看社区活动"
    >
      <div class="flex items-center gap-2">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span class="font-bold hidden group-hover:inline-block transition-all">社区活动</span>
      </div>
    </div>
  </div>
</template>
