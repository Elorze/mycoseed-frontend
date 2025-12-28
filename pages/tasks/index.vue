<template>
  <div class="min-h-screen bg-mario-sky py-8">
    <div class="container mx-auto px-6">
      <!-- 创建任务按钮 -->
      <div v-if="isAuthenticated" class="mb-6 flex justify-end gap-2">
        <button
          @click="navigateTo('/tasks/create')"
          class="create-task-btn relative px-4 py-2.5 font-pixel text-xs uppercase"
        >
          <span class="relative z-10 flex items-center gap-1.5 whitespace-nowrap">
            <span class="text-base">🎯</span>
            <span class="font-bold">创建任务</span>
          </span>
        </button>
      </div>

      <!-- 操作栏 -->
      <div class="mb-6 flex flex-col sm:flex-row justify-start items-center gap-4">
        <!-- 状态筛选 -->
        <div class="flex gap-2">
          <button
            v-for="tab in statusTabs"
            :key="tab.id"
            @click="activeStatusTab = tab.id"
            :class="[
              'px-4 py-2 font-pixel text-xs uppercase border-2 border-black transition-all',
              activeStatusTab === tab.id
                ? 'bg-mario-red text-white shadow-pixel'
                : 'bg-white text-black hover:bg-gray-100'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-12">
        <div class="font-pixel text-xl text-white animate-pulse">加载中...</div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="filteredItems.length === 0" class="text-center py-12">
        <div class="font-pixel text-xl text-white mb-4">暂无内容</div>
      </div>

      <!-- 内容列表 -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- 任务卡片 -->
        <PixelCard
          v-for="item in filteredItems"
          :key="`task-${item.id}`"
          hover
          class="cursor-pointer"
          @click="navigateTo(`/tasks/${item.id}`)"
        >
          <template #header>
            <div class="flex justify-between items-start">
              <span class="text-gray-600 text-xs">任务 #{{ item.id }}</span>
              <span class="text-xs text-gray-400">{{ formatTimeAgo(item.deadline || item.createdAt) }}</span>
            </div>
          </template>
          
          <div class="flex gap-4">
            <PixelAvatar :seed="item.creator || `user${item.id}`" size="md" />
            <div class="flex-1">
              <h3 class="font-bold text-lg">{{ item.title }}</h3>
              <p class="text-gray-600 text-sm line-clamp-2">{{ item.description }}</p>
            </div>
          </div>

          <template #footer>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="text-mario-coin font-bold flex items-center gap-1">
                  <div class="w-3 h-3 bg-mario-coin rounded-sm"></div>
                  {{ item.reward || 0 }} 积分
                </div>
                <span class="text-xs bg-gray-200 px-2 py-1 font-pixel uppercase">{{ getTaskStatusText(item.status) }}</span>
              </div>
              <PixelButton 
                v-if="item.status === 'unclaimed'"
                size="sm" 
                variant="secondary"
                @click.stop="navigateTo(`/tasks/${item.id}`)"
              >
                查看详情
              </PixelButton>
            </div>
          </template>
        </PixelCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import PixelCard from '~/components/pixel/PixelCard.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'
import PixelAvatar from '~/components/pixel/PixelAvatar.vue'
import { useUserStore } from '~/stores/user'
import { getAllTasks, type Task } from '~/utils/api'

definePageMeta({
  layout: 'default'
})

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 判断用户是否已登录
const isAuthenticated = computed(() => {
  return !!userStore.user
})

const navigateTo = (path: string) => {
  router.push(path)
}

// 状态筛选标签
const activeStatusTab = ref('all')
const statusTabs = [
  { id: 'all', label: '全部' },
  { id: 'pending', label: '待开始' },
  { id: 'in_progress', label: '进行中' },
  { id: 'completed', label: '已完成' }
]

// 加载状态
const loading = ref(false)

// 任务列表
const tasks = ref<Task[]>([])

// 从 API 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const apiTasks = await getAllTasks()
    tasks.value = apiTasks
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 任务数据项类型
interface TaskItem {
  id: string | number
  title: string
  description: string
  status: string
  reward?: number
  deadline?: string
  createdAt?: string
  creator?: string
}

// 任务列表
const taskItems = computed<TaskItem[]>(() => {
  return tasks.value.map(task => ({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    reward: task.reward,
    deadline: task.deadline || task.completedAt || task.updatedAt || task.createdAt || '',
    createdAt: task.createdAt,
    creator: task.creatorName || '系统'
  }))
})

// 状态映射：将任务状态映射到筛选状态
const mapTaskStatusToFilter = (status: string): string => {
  if (status === 'unclaimed') return 'pending'
  if (status === 'in_progress') return 'in_progress'
  if (status === 'completed') return 'completed'
  return status
}

// 过滤后的任务列表
const filteredItems = computed(() => {
  let items = taskItems.value
  
  // 状态筛选
  if (activeStatusTab.value !== 'all') {
    items = items.filter(item => {
      const filterStatus = mapTaskStatusToFilter(item.status)
      return filterStatus === activeStatusTab.value
    })
  }
  
  return items
})

// 任务状态文本
const getTaskStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'unclaimed': '未领取',
    'in_progress': '进行中',
    'completed': '已完成',
    'under_review': '审核中',
    'rejected': '已驳回'
  }
  return statusMap[status] || '未知'
}

// 格式化时间差（与首页一致）
const formatTimeAgo = (dateString: string): string => {
  if (!dateString) return ''
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 60) {
    return `${diffMins}分钟前`
  } else if (diffHours < 24) {
    return `${diffHours}小时前`
  } else {
    return `${diffDays}天前`
  }
}


// 组件挂载时加载数据
onMounted(async () => {
  // 确保用户信息已加载
  await userStore.getUser()
  loadData()
})

// 监听路由变化，当从创建页面返回时重新加载
watch(() => route.fullPath, () => {
  if (route.path === '/tasks') {
    loadData()
  }
}, { immediate: false })
</script>

<style scoped>
.create-task-btn {
  /* 机械键盘按钮风格：白底黑框 */
  background: #ffffff;
  color: #000000;
  border: 3px solid #000000;
  
  /* 无阴影 */
  box-shadow: none;
  
  /* 轻微浮动动画（包含缩放） */
  animation: float-gentle 3s ease-in-out infinite;
  
  /* 过渡效果 */
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  
  /* 像素风格 */
  image-rendering: pixelated;
  position: relative;
  overflow: visible;
}

/* 轻微浮动动画 */
@keyframes float-gentle {
  0%, 100% {
    transform: translateY(0px) scale(0.85);
  }
  50% {
    transform: translateY(-2px) scale(0.85);
  }
}

/* Hover 效果：放大、旋转、上浮 */
.create-task-btn:hover {
  transform: translateY(-4px) rotate(2deg) scale(1);
  box-shadow: none;
  animation-play-state: paused;
}

/* Active 效果：点击放大到当前尺度 */
.create-task-btn:active {
  transform: translateY(0px) rotate(0deg) scale(1);
  box-shadow: none;
  animation-play-state: paused;
}

/* 表情动画 */
.create-task-btn .text-base {
  display: inline-block;
  animation: emoji-bounce 2s ease-in-out infinite;
}

@keyframes emoji-bounce {
  0%, 100% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(1.1) rotate(-5deg);
  }
  75% {
    transform: scale(1.1) rotate(5deg);
  }
}
</style>




