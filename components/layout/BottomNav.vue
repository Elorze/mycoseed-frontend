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
  { label: '广场', path: '/', icon: '🗺️' },
  { label: '任务', path: '/tasks', icon: '📋' },
  { label: '钱包', path: '/wallet', icon: '💰' },
  { label: '我的', path: '/member/1', icon: '👤' }
]

const navigateTo = (path: string) => {
  router.push(path)
}
</script>


