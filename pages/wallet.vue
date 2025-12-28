<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <p class="font-vt323 text-lg text-gray-600 mb-4">钱包功能已迁移到个人页面</p>
      <p class="font-pixel text-sm text-gray-500 mb-4">正在跳转...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '~/stores/user'

definePageMeta({
  layout: 'default'
})

const router = useRouter()
const userStore = useUserStore()

onMounted(async () => {
  // 获取当前用户ID并重定向到个人页面
  const user = await userStore.getUser()
  if (user && user.id) {
    router.replace(`/member/${user.id}`)
  } else {
    // 如果用户未登录，重定向到登录页或首页
    router.replace('/')
  }
})
</script>
