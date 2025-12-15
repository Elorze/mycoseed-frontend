<template>
  <div class="min-h-screen bg-mario-sky py-8">
    <div class="container mx-auto px-6">
      <!-- 页面标题 -->
      <div class="mb-8 text-center">
        <h1 class="font-pixel text-3xl md:text-4xl text-white text-shadow-pixel mb-4">任务列表</h1>
        <div class="w-32 h-1 bg-white mx-auto border-2 border-black"></div>
      </div>

      <!-- 操作栏 -->
      <div class="mb-6 flex flex-col sm:flex-row justify-start items-center gap-4">
        <div class="flex gap-4">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-6 py-2 font-pixel text-sm uppercase border-2 border-black transition-all',
              activeTab === tab.id
                ? 'bg-mario-red text-white shadow-pixel'
                : 'bg-white text-black hover:bg-gray-100'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- 任务列表 -->
      <div v-if="loading" class="text-center py-12">
        <div class="font-pixel text-xl text-white animate-pulse">加载中...</div>
      </div>

      <div v-else-if="filteredTasks.length === 0" class="text-center py-12">
        <div class="font-pixel text-xl text-white mb-4">暂无任务</div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PixelCard
          v-for="task in filteredTasks"
          :key="task.id"
          class="hover:-translate-y-1 transition-all cursor-pointer"
          @click="navigateTo(`/tasks/${task.id}`)"
        >
          <template #header>
            <div class="flex justify-between items-start">
              <h3 class="font-pixel text-sm text-black line-clamp-1">{{ task.title }}</h3>
              <span
                class="px-2 py-1 text-xs font-pixel uppercase border border-black"
                :class="getStatusClass(task.status)"
              >
                {{ getStatusText(task.status) }}
              </span>
            </div>
          </template>

          <div class="space-y-3">
            <p class="font-vt323 text-base text-black line-clamp-2">{{ task.objective || task.description }}</p>
            
            <div class="space-y-2 text-sm font-vt323">
              <div class="flex items-center gap-2 text-black">
                <span>💰</span>
                <span class="font-bold text-mario-coin">{{ task.reward }} 积分</span>
              </div>
              <div class="flex items-center gap-2 text-gray-600">
                <span>📅</span>
                <span>{{ formatDate(task.deadline) }}</span>
              </div>
              <div v-if="task.creator" class="flex items-center gap-2 text-gray-600">
                <span>👤</span>
                <span>{{ task.creator }}</span>
              </div>
            </div>
          </div>

          <template #footer>
            <PixelButton
              variant="secondary"
              size="sm"
              class="w-full"
              @click.stop="navigateTo(`/tasks/${task.id}`)"
            >
              查看详情
            </PixelButton>
          </template>
        </PixelCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PixelCard from '~/components/pixel/PixelCard.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'
import { getAllTasks } from '~/utils/api'

definePageMeta({
  layout: 'default'
})

const router = useRouter()

const navigateTo = (path: string) => {
  router.push(path)
}

// 标签页
const activeTab = ref('all')
const tabs = [
  { id: 'all', label: '全部' },
  { id: 'unclaimed', label: '未领取' },
  { id: 'in_progress', label: '进行中' },
  { id: 'completed', label: '已完成' }
]

// 加载状态
const loading = ref(false)

// 本地任务类型（扩展了 Task 接口）
interface LocalTask {
  id: string
  title: string
  objective: string
  description: string
  reward: number
  deadline: string
  status: string
  creator: string
}

// 任务列表
const tasks = ref<LocalTask[]>([])

// 从 API 加载任务
const loadTasksFromAPI = async () => {
  try {
    const apiTasks = await getAllTasks()
    // 转换 API 任务格式为页面需要的格式
    tasks.value = apiTasks.map(task => ({
      id: String(task.id),
      title: task.title,
      objective: task.description,
      description: task.description,
      reward: task.reward,
      deadline: task.deadline || task.completedAt || task.updatedAt || task.createdAt || '',
      status: task.status,
      creator: task.creatorName || '系统'
    }))
  } catch (error) {
    console.error('加载任务失败:', error)
  }
}

// 过滤后的任务列表
const filteredTasks = computed(() => {
  if (activeTab.value === 'all') {
    return tasks.value
  }
  return tasks.value.filter(task => task.status === activeTab.value)
})

// 状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'unclaimed': '未领取',
    'in_progress': '进行中',
    'completed': '已完成',
    'under_review': '审核中',
    'rejected': '已驳回'
  }
  return statusMap[status] || '未知'
}

// 状态样式
const getStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    'unclaimed': 'bg-yellow-100 text-yellow-800',
    'in_progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'under_review': 'bg-orange-100 text-orange-800',
    'rejected': 'bg-red-100 text-red-800'
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// 加载任务列表
const loadTasks = async () => {
  loading.value = true
  try {
    await loadTasksFromAPI()
  } catch (error) {
    console.error('加载任务失败:', error)
  } finally {
    loading.value = false
  }
}

// 组件挂载时加载任务
onMounted(() => {
  loadTasks()
})

// 监听路由变化，当从创建页面返回时重新加载
const route = useRoute()
watch(() => route.fullPath, () => {
  if (route.path === '/tasks') {
    loadTasks()
  }
}, { immediate: false })
</script>

<style scoped>
.text-shadow-pixel {
  text-shadow: 3px 3px 0px rgba(0, 0, 0, 0.3);
}
</style>




