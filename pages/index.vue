<template>
  <div class="relative h-[calc(100vh-140px)] -mx-4 -my-8 overflow-hidden">
    <!-- Sidebar -->
    <SquareSidebar 
      @filter="handleFilter" 
      @select-community="handleCommunitySelect"
      @preview-community="handleCommunityPreview"
      @clear-preview="handleClearPreview"
      @activity-click="handleActivityClick"
    />

    <!-- Graph Layer -->
    <ClientOnly>
      <NetworkCanvas ref="networkCanvas" @nodeClick="handleNodeClick" />
      <template #fallback>
        <div class="w-full h-full flex items-center justify-center bg-mario-sky">
          <div class="text-center">
            <span class="font-pixel text-2xl animate-pulse text-white text-shadow-pixel block mb-4">正在加载世界...</span>
            <div class="flex gap-2 justify-center">
              <div class="w-2 h-2 bg-white border border-black animate-bounce" style="animation-delay: 0s"></div>
              <div class="w-2 h-2 bg-white border border-black animate-bounce" style="animation-delay: 0.2s"></div>
              <div class="w-2 h-2 bg-white border border-black animate-bounce" style="animation-delay: 0.4s"></div>
            </div>
          </div>
        </div>
      </template>
    </ClientOnly>

    <!-- UI Overlay Layer -->
    <div class="absolute inset-0 pointer-events-none p-4 md:p-8">
      
      <!-- Floating decorative elements for pixel feel -->
      <div class="absolute top-20 left-8 pointer-events-none animate-float">
        <div class="w-4 h-4 bg-mario-coin border-2 border-black shadow-pixel-sm"></div>
      </div>
      <div class="absolute top-32 right-12 pointer-events-none animate-float-delayed">
        <div class="w-3 h-3 bg-mario-red border-2 border-black shadow-pixel-sm"></div>
      </div>
      <div class="absolute bottom-32 left-16 pointer-events-none animate-float-slow">
        <div class="w-3 h-3 bg-mario-green border-2 border-black shadow-pixel-sm"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import NetworkCanvas from '~/components/graph/NetworkCanvas.vue'
import SquareSidebar from '~/components/square/SquareSidebar.vue'
import { useUserStore } from '~/stores/user'

// Use definePageMeta to ensure layout is applied
definePageMeta({
  layout: 'default'
})

const router = useRouter()
const userStore = useUserStore()
const networkCanvas = ref<any>(null)

const handleFilter = (filter: any) => {
  if (networkCanvas.value) {
    networkCanvas.value.filterNodes(filter)
  }
}

const handleCommunitySelect = (id: number) => {
  router.push(`/community/${id}`)
}

const handleCommunityPreview = (id: number) => {
  if (networkCanvas.value && typeof networkCanvas.value.highlightCommunity === 'function') {
    networkCanvas.value.highlightCommunity(id)
  }
}

const handleClearPreview = () => {
  if (networkCanvas.value && typeof networkCanvas.value.clearHighlight === 'function') {
    networkCanvas.value.clearHighlight()
  }
}

const inferCommunityIdFromLog = (log: any): number | null => {
  if (log.type === 'join' || log.type === 'new_community') {
    return log.targetId
  }

  if (log.type === 'complete_task' || log.type === 'create_proposal') {
    // 根据文案简单推断所属社区（mock 数据）
    if (log.targetName?.includes('民宿') || log.targetName?.includes('南塘')) {
      return 2
    }
    return 1
  }

  return null
}

const handleActivityClick = async (log: any) => {
  const communityId = inferCommunityIdFromLog(log)

  if (communityId && networkCanvas.value && typeof networkCanvas.value.highlightCommunity === 'function') {
    networkCanvas.value.highlightCommunity(communityId)
  }

  if (log.type === 'join' || log.type === 'new_community') {
    await router.push(`/community/${log.targetId}`)
  } else if (log.type === 'complete_task') {
    await router.push('/tasks')
  } else if (log.type === 'create_proposal') {
    if (communityId) {
      await router.push(`/community/${communityId}`)
    } else {
      await router.push('/activities')
    }
  }
}


// 检查用户认证状态，未登录则重定向到登录页
onMounted(async () => {
  const user = await userStore.getUser()
  if (!user) {
    await router.push('/login')
  }
})

const handleNodeClick = (node: any) => {
  if (node.type === 'COMMUNITY') {
    // Mock ID mapping: comm1 -> 1
    const id = node.id.replace('comm', '') || '1'
    router.push(`/community/${id}`)
  } else if (node.type === 'USER') {
    // Mock ID mapping: user1 -> 1
    const id = node.id.replace('user', '') || '1'
    router.push(`/member/${id}`)
  }
}
</script>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(5deg);
  }
}

@keyframes float-delayed {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(-5deg);
  }
}

@keyframes float-slow {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-8px) rotate(3deg);
  }
}

@keyframes pulse-hover {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.animate-slide-down {
  animation: slide-down 0.6s ease-out;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 4s ease-in-out infinite;
  animation-delay: 1s;
}

.animate-float-slow {
  animation: float-slow 5s ease-in-out infinite;
  animation-delay: 2s;
}

.animate-pulse-hover {
  animation: pulse-hover 2s ease-in-out infinite;
}

.animate-pulse-hover:hover {
  animation: none;
  transform: scale(1.1);
}
</style>
