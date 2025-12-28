<template>
  <header class="h-16 md:h-20 border-b-4 border-black bg-white sticky top-0 z-50 shadow-pixel">
    <div class="w-full md:max-w-7xl md:mx-auto px-2 md:px-4 h-full flex items-center justify-between">
      <!-- Community Switcher -->
      <div class="relative">
        <button
          class="flex items-center gap-3 cursor-pointer group"
          @click="toggleDropdown"
          @blur="handleBlur"
        >
          <div class="w-12 h-12 bg-mario-red border-4 border-black flex items-center justify-center shadow-pixel group-hover:-translate-y-1 transition-transform">
            <img src="/images/icons/myco-seed-logo.svg" alt="MycoSeed" class="w-8 h-8" style="image-rendering: pixelated;" />
          </div>
          <div class="hidden md:block text-left">
            <h1 class="font-pixel text-black text-sm md:text-base leading-tight">
              {{ currentCommunityName || '选择社区' }}
            </h1>
            <p class="font-vt323 text-gray-600 text-sm">切换频道</p>
          </div>
          <div class="ml-2">
            <svg 
              class="w-4 h-4 transition-transform"
              :class="{ 'rotate-180': isDropdownOpen }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </button>
        
        <!-- Dropdown Menu -->
        <Transition name="dropdown">
          <div 
            v-if="isDropdownOpen" 
            class="absolute top-full left-0 mt-2 w-64 bg-white border-4 border-black shadow-pixel z-50"
          >
            <div class="p-2 space-y-1 max-h-96 overflow-y-auto">
              <div 
                v-for="community in communities" 
                :key="community.id"
                class="p-3 cursor-pointer hover:bg-gray-100 border-2 border-transparent hover:border-black transition-all"
                :class="{ 'bg-mario-red/10 border-black': community.id === communityStore.currentCommunityId }"
                @click="selectCommunity(community.id)"
              >
                <div class="font-pixel text-sm font-bold">{{ community.name }}</div>
                <div class="font-vt323 text-xs text-gray-600 mt-1">{{ community.description }}</div>
                <div class="font-vt323 text-xs text-gray-500 mt-1">
                  {{ community.pointName || '积分' }}: {{ community.totalPoints }}
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Navigation -->
      <nav class="flex items-center gap-4">
        
        <!-- Marketplace (Replacing Level Bar) -->
        <PixelButton
           variant="warning"
           size="sm"
           @click="navigateTo('tasks')"
        >
           🛒 商城
        </PixelButton>

        <!-- Wallet -->
        <PixelButton
          :variant="currentPage === 'wallet' ? 'primary' : 'secondary'"
          size="sm"
          @click="navigateTo('wallet')"
        >
          👛 钱包
        </PixelButton>

        <!-- User Avatar (Replacing Address) -->
        <div 
          class="cursor-pointer hover:scale-110 transition-transform"
          @click="navigateTo('profile')"
          title="个人主页"
        >
           <PixelAvatar seed="Alice" size="md" />
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import PixelButton from '~/components/pixel/PixelButton.vue'
import PixelAvatar from '~/components/pixel/PixelAvatar.vue'
import { useCommunityStore } from '~/stores/community'
import type { Community } from '~/utils/api'

interface Props {
  currentPage?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  navigate: [page: string]
}>()

const router = useRouter()
const communityStore = useCommunityStore()
const isDropdownOpen = ref(false)
const communities = ref<Community[]>([])

const currentCommunityName = computed(() => {
  return communityStore.currentCommunity?.name || null
})

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const handleBlur = (e: FocusEvent) => {
  // 延迟关闭，以便点击事件能够触发
  setTimeout(() => {
    const target = e.relatedTarget as HTMLElement | null
    const currentTarget = e.currentTarget as HTMLElement | null
    if (!target || (currentTarget && !currentTarget.contains(target))) {
      isDropdownOpen.value = false
    }
  }, 200)
}

const selectCommunity = async (id: number) => {
  await communityStore.setCurrentCommunity(id)
  isDropdownOpen.value = false
  // 跳转到首页
  router.push('/')
}

const loadCommunities = async () => {
  try {
    communities.value = await communityStore.getAllCommunities()
  } catch (error) {
    console.error('Failed to load communities:', error)
  }
}

// 监听社区变化，更新下拉菜单
watch(() => communityStore.currentCommunityId, () => {
  // 可以在这里添加额外的逻辑
})

onMounted(async () => {
  // 初始化社区 store
  await communityStore.initialize()
  // 加载社区列表
  await loadCommunities()
})

const navigateTo = (page: string) => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/af348509-5d27-4b86-baea-9c27926471bf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: 'debug-session',
      runId: 'nav-structure',
      hypothesisId: 'H1',
      location: 'components/layout/Header.vue:navigateTo',
      message: 'Header navigateTo called',
      data: { page, currentPage: props.currentPage },
      timestamp: Date.now()
    })
  }).catch(() => {})
  // #endregion

  if (page === 'profile') {
    // Mock ID 1 for current user
    emit('navigate', 'member/1')
  } else {
    emit('navigate', page)
  }
}
</script>
