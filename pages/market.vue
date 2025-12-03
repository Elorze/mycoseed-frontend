<template>
  <div class="max-w-5xl mx-auto w-full space-y-8">
    
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="font-pixel text-2xl md:text-3xl text-black flex items-center gap-3">
          <span class="text-4xl">🛒</span> 交换市集
        </h1>
        <p class="font-vt323 text-xl text-gray-600">交换价值</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex border-b-4 border-black">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'px-6 py-3 font-pixel text-sm transition-all border-t-4 border-x-4 border-black -mb-1 mr-2',
          activeTab === tab.id ? 'bg-mario-red text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Task List -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PixelCard v-for="task in filteredTasks" :key="task.id" hover>
        <template #header>
          <div class="flex justify-between items-start">
            <span :class="task.type === 'OFFER' ? 'text-blue-600' : 'text-red-600'">
              [{{ task.type === 'OFFER' ? '提供帮助' : '需要帮助' }}]
            </span>
            <span class="text-xs text-gray-400 font-pixel">{{ task.statusLabel }}</span>
          </div>
        </template>
        
        <div class="flex gap-4">
          <PixelAvatar :seed="task.author" size="md" />
          <div class="flex-1">
            <h3 class="font-bold text-lg font-vt323 line-clamp-1">{{ task.title }}</h3>
            <p class="text-gray-600 text-sm line-clamp-2 mb-2">{{ task.description }}</p>
            
            <!-- Details -->
            <div class="text-xs text-gray-500 space-y-1 font-vt323">
              <div class="flex items-center gap-2">
                <span>👤 {{ task.type === 'OFFER' ? '提供者' : '需求者' }}: {{ task.author }}</span>
              </div>
              <div v-if="task.participant" class="flex items-center gap-2">
                <span>🤝 参与者: {{ task.participant }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span>📍 {{ task.location }}</span>
                <span>🕒 {{ task.time }}</span>
              </div>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex items-center gap-2">
            <div class="text-mario-coin font-bold flex items-center gap-1">
              <div class="w-3 h-3 bg-mario-coin rounded-sm"></div>
              {{ task.reward }} 积分
            </div>
          </div>
          <PixelButton size="sm" :variant="task.status === 'OPEN' ? 'secondary' : 'ghost'" :disabled="task.status !== 'OPEN'">
            {{ task.status === 'OPEN' ? '接取任务' : '进行中' }}
          </PixelButton>
        </template>
      </PixelCard>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PixelCard from '~/components/pixel/PixelCard.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'
import PixelAvatar from '~/components/pixel/PixelAvatar.vue'

definePageMeta({
  layout: 'default'
})

const router = useRouter()
const activeTab = ref('ALL')

const tabs = [
  { id: 'ALL', label: '全部' },
  { id: 'OFFER', label: '提供帮助 (Offer)' },
  { id: 'NEED', label: '需要帮助 (Need)' }
]

const navigateTo = (path: string) => {
  router.push(path)
}

// Mock Data
const tasks = ref([
  {
    id: 1,
    type: 'NEED',
    title: '修水管急需帮助',
    description: '厨房水管爆了，满地都是水，求一个懂水管的邻居帮忙！',
    author: 'Peach',
    reward: 50,
    location: '蘑菇公寓 302',
    time: '今天 14:00',
    status: 'OPEN',
    statusLabel: '开放中'
  },
  {
    id: 2,
    type: 'OFFER',
    title: '周末免费顺风车',
    description: '这周末要去市区，车上有3个空位，可以免费带邻居。',
    author: 'Toad',
    reward: 10,
    location: '村口大树',
    time: '周六 09:00',
    status: 'OPEN',
    statusLabel: '开放中'
  },
  {
    id: 3,
    type: 'NEED',
    title: '打败库巴魔王',
    description: '他又来了，这次需要组建一个4人小队。',
    author: 'Mario',
    participant: 'Luigi',
    reward: 9999,
    location: '库巴城堡',
    time: '随时',
    status: 'IN_PROGRESS',
    statusLabel: '进行中'
  },
  {
    id: 4,
    type: 'OFFER',
    title: '教你画像素画',
    description: '专业的像素艺术家，在线教学，包教包会。',
    author: 'Alice',
    reward: 20,
    location: '线上 Discord',
    time: '周日 20:00',
    status: 'OPEN',
    statusLabel: '开放中'
  }
])

const filteredTasks = computed(() => {
  if (activeTab.value === 'ALL') return tasks.value
  return tasks.value.filter(t => t.type === activeTab.value)
})
</script>


