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


    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="font-pixel text-xl text-gray-600 animate-pulse">加载中...</div>
    </div>

    <!-- Empty State -->
    <div v-else-if="tasks.length === 0" class="text-center py-12">
      <div class="font-pixel text-xl text-gray-600 mb-4">暂无任务</div>
      <PixelButton variant="secondary" @click="loadTasks">刷新</PixelButton>
    </div>

    <!-- Task List -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PixelCard 
        v-for="task in tasks" 
        :key="task.id" 
        hover
        class="cursor-pointer"
        @click="goToTaskDetail(task.id)"
      >
        <template #header>
          <div class="flex justify-between items-start">
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
                <span>👤 发布者: {{ task.author }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span>📍 {{ task.location }}</span>
                <span>🕒 {{ task.time }}</span>
              </div>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex items-center justify-between gap-2">
            <div class="text-mario-coin font-bold flex items-center gap-1">
              <div class="w-3 h-3 bg-mario-coin rounded-sm"></div>
              {{ task.reward }} 积分
            </div>
            <PixelButton 
              size="sm" 
              :variant="task.status === 'unclaimed' ? 'secondary' : 'ghost'" 
              :disabled="task.status !== 'unclaimed'"
              @click.stop="handleClaimTask(task.id, $event)"
            >
              {{ task.status === 'unclaimed' ? '接取任务' : getStatusText(task.status) }}
            </PixelButton>
          </div>
        </template>
      </PixelCard>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PixelCard from '~/components/pixel/PixelCard.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'
import PixelAvatar from '~/components/pixel/PixelAvatar.vue'
import { getAllTasks, claimTask } from '~/utils/api'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'default'
})

const router = useRouter()
const toast = useToast()
const loading = ref(false)

const navigateTo = (path: string) => {
  router.push(path)
}

// 任务列表
const tasks = ref<any[]>([])

// 从 API 加载任务
const loadTasks = async () => {
  loading.value = true
  try {
    const apiTasks = await getAllTasks()
    // 转换 API 任务格式为页面需要的格式
    tasks.value = apiTasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      reward: task.reward,
      status: task.status,
      author: task.creatorName || '发布者',
      statusLabel: getStatusText(task.status),
      location: '社区',
      time: formatTime(task.createdAt)
    }))
  } catch (error) {
    console.error('加载任务失败:', error)
    toast.add({
      title: '加载失败',
      description: '无法加载任务列表，请稍后重试',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

// 状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'unclaimed': '开放中',
    'in_progress': '进行中',
    'under_review': '审核中',
    'completed': '已完成',
    'rejected': '已驳回'
  }
  return statusMap[status] || '未知'
}

// 格式化时间
const formatTime = (dateString?: string) => {
  if (!dateString) return '刚刚'
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN')
}

// 领取任务
const handleClaimTask = async (taskId: string, event: Event) => {
  event.stopPropagation() // 阻止事件冒泡，避免跳转到详情页
  
  try {
    const result = await claimTask(taskId)
    if (result.success) {
      toast.add({
        title: '领取成功',
        description: result.message,
        color: 'green'
      })
      // 刷新任务列表
      await loadTasks()
    } else {
      toast.add({
        title: '领取失败',
        description: result.message,
        color: 'red'
      })
    }
  } catch (error) {
    console.error('领取任务失败:', error)
    toast.add({
      title: '领取失败',
      description: '网络错误，请稍后重试',
      color: 'red'
    })
  }
}

// 跳转到任务详情
const goToTaskDetail = (taskId: string) => {
  router.push(`/tasks/${taskId}`)
}


// 组件挂载时加载任务
onMounted(() => {
  loadTasks()
})
</script>


