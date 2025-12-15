<template>
  <div class="min-h-screen bg-background">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 页头 -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-4">
            <button
              @click="navigateTo('/')"
              class="p-2 rounded-lg hover:bg-white/80 transition-colors cursor-pointer"
            >
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 class="text-3xl font-bold text-foreground">社区活动</h1>
          </div>
          
          <button
            @click="showMyTasks = true"
            class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            我的任务
          </button>
        </div>
        
        <!-- 状态筛选标签 -->
        <div class="flex gap-3 flex-wrap">
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="activeFilter = filter.value"
            class="px-4 py-2 rounded-lg font-medium transition-all duration-200"
            :class="
              activeFilter === filter.value
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            "
          >
            {{ filter.label }}
            <span
              v-if="filter.count > 0"
              class="ml-2 px-2 py-0.5 rounded-full text-xs"
              :class="
                activeFilter === filter.value
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-600'
              "
            >
              {{ filter.count }}
            </span>
          </button>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="i in 6"
          :key="i"
          class="h-96 rounded-xl bg-white animate-pulse"
        >
          <div class="h-48 bg-gray-200 rounded-t-xl"></div>
          <div class="p-4 space-y-3">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-3 bg-gray-200 rounded w-full"></div>
            <div class="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>

      <!-- 活动列表 -->
      <div
        v-else-if="filteredActivities.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <ActivityCard
          v-for="activity in filteredActivities"
          :key="activity.id"
          :activity="activity"
        />
      </div>

      <!-- 空状态 -->
      <div
        v-else
        class="flex flex-col items-center justify-center py-20"
      >
        <svg class="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <h3 class="text-xl font-semibold text-gray-600 mb-2">暂无活动</h3>
        <p class="text-gray-500">{{ emptyMessage }}</p>
      </div>

      <!-- 统计信息 -->
      <div v-if="!loading && activities.length > 0" class="mt-12 bg-white rounded-xl shadow-md p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">活动统计</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600">{{ statistics.total }}</div>
            <div class="text-sm text-gray-600 mt-1">总活动数</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600">{{ statistics.ongoing }}</div>
            <div class="text-sm text-gray-600 mt-1">进行中</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-purple-600">{{ statistics.upcoming }}</div>
            <div class="text-sm text-gray-600 mt-1">即将开始</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-orange-600">{{ statistics.totalParticipants }}</div>
            <div class="text-sm text-gray-600 mt-1">总参与人数</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 我的任务弹窗 -->
    <div
      v-if="showMyTasks"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click="showMyTasks = false"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
        @click.stop
      >
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">我的任务</h2>
          <button
            @click="showMyTasks = false"
            class="text-gray-500 hover:text-gray-700"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="myTasks.length === 0" class="text-center py-12 text-gray-500">
          您还没有领取任何任务
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="task in myTasks"
            :key="task.id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-lg font-semibold text-gray-900">{{ task.title }}</h3>
                  <span 
                    class="px-3 py-1 rounded-full text-sm font-medium"
                    :class="{
                      'bg-yellow-50 text-yellow-700': task.status === 'unclaimed',
                      'bg-blue-50 text-blue-700': task.status === 'in_progress',
                      'bg-orange-50 text-orange-700': task.status === 'under_review',
                      'bg-green-50 text-green-700': task.status === 'completed',
                      'bg-red-50 text-red-700': task.status === 'rejected'
                    }"
                  >
                    {{ getTaskStatusText(task.status) }}
                  </span>
                  <span 
                    v-if="task.discount"
                    class="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium"
                  >
                    <span class="line-through opacity-60">{{ task.reward }} 积分</span>
                    → {{ getFinalReward(task) }} 积分 ({{ task.discount }}%)
                  </span>
                  <span v-else class="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                    {{ task.reward }} 积分
                  </span>
                </div>
                <p class="text-gray-600 mb-3">{{ task.description }}</p>
                
                <!-- 任务进度条 -->
                <div class="mb-3">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-sm text-gray-600">任务进度</span>
                    <span class="text-sm font-medium text-gray-900">{{ getTaskProgress(task) }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      class="h-2 rounded-full transition-all duration-300"
                      :class="{
                        'bg-yellow-500': task.status === 'unclaimed',
                        'bg-blue-500': task.status === 'in_progress',
                        'bg-orange-500': task.status === 'under_review',
                        'bg-green-500': task.status === 'completed',
                        'bg-red-500': task.status === 'rejected'
                      }"
                      :style="{ width: `${getTaskProgress(task)}%` }"
                    ></div>
                  </div>
                </div>
                
                <!-- 任务信息 -->
                <div class="text-sm text-gray-500 space-y-1">
                  <div v-if="task.creatorId === 1" class="text-blue-600">
                    📌 我发布的任务
                  </div>
                  <div v-if="task.claimerId === 1" class="text-green-600">
                    ✅ 我领取的任务
                  </div>
                  <div v-if="task.proof" class="text-green-600">
                    ✓ 已提交凭证
                  </div>
                  <div v-if="task.discountReason" class="text-orange-600">
                    打折理由：{{ task.discountReason }}
                  </div>
                </div>
              </div>
              <div class="ml-4 flex flex-col gap-2">
                <button
                  v-if="task.status === 'in_progress' && task.claimerId === 1"
                  @click="openProofModal(task)"
                  class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap text-sm"
                >
                  提交凭证
                </button>
                <button
                  v-if="task.status === 'under_review' && task.creatorId === 1"
                  @click="goToReview(task.id)"
                  class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap text-sm"
                >
                  审核任务
                </button>
                <button
                  @click="goToTaskDetail(task.id)"
                  class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap text-sm"
                >
                  查看详情
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 提交凭证弹窗 -->
    <div
      v-if="showProofModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]"
      @click="showProofModal = false"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4"
        @click.stop
      >
        <h2 class="text-2xl font-bold text-gray-900 mb-4">提交完成凭证</h2>
        <p class="text-gray-600 mb-4">任务：{{ selectedTask?.title }}</p>
        
        <textarea
          v-model="proofText"
          placeholder="请输入完成凭证..."
          class="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
        ></textarea>
        
        <div class="flex gap-3 mt-4">
          <button
            @click="handleSubmitProof"
            :disabled="!proofText.trim()"
            class="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            提交
          </button>
          <button
            @click="showProofModal = false"
            class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import ActivityCard from '~/components/ActivityCard.vue'
import { useApi } from '~/composables/useApi'
import type { Activity, Task } from '~/utils/api'

const { getActivities, getMyTasks, getAllTasks, submitProof, getFinalReward } = useApi()

// 响应式数据
const loading = ref(true)
const activities = ref<Activity[]>([])
const activeFilter = ref<'all' | 'upcoming' | 'ongoing' | 'ended'>('all')
const showMyTasks = ref(false)
const myTasks = ref<Task[]>([])
const showProofModal = ref(false)
const selectedTask = ref<Task | null>(null)
const proofText = ref('')

// 筛选器配置
const filters = computed(() => [
  {
    label: '全部',
    value: 'all' as const,
    count: activities.value.length
  },
  {
    label: '即将开始',
    value: 'upcoming' as const,
    count: activities.value.filter(a => a.status === 'upcoming').length
  },
  {
    label: '进行中',
    value: 'ongoing' as const,
    count: activities.value.filter(a => a.status === 'ongoing').length
  },
  {
    label: '已结束',
    value: 'ended' as const,
    count: activities.value.filter(a => a.status === 'ended').length
  }
])

// 过滤后的活动列表
const filteredActivities = computed(() => {
  if (activeFilter.value === 'all') {
    return activities.value
  }
  return activities.value.filter(activity => activity.status === activeFilter.value)
})

// 空状态消息
const emptyMessage = computed(() => {
  switch (activeFilter.value) {
    case 'upcoming':
      return '暂无即将开始的活动'
    case 'ongoing':
      return '暂无进行中的活动'
    case 'ended':
      return '暂无已结束的活动'
    default:
      return '暂无任何活动'
  }
})

// 统计信息
const statistics = computed(() => ({
  total: activities.value.length,
  upcoming: activities.value.filter(a => a.status === 'upcoming').length,
  ongoing: activities.value.filter(a => a.status === 'ongoing').length,
  ended: activities.value.filter(a => a.status === 'ended').length,
  totalParticipants: activities.value.reduce((sum, a) => sum + a.participants, 0)
}))

// 加载活动数据
const loadActivities = async () => {
  try {
    loading.value = true
    // 获取所有活动
    activities.value = await getActivities()
    console.log('✅ 成功加载活动数据:', activities.value.length, '个活动')
  } catch (error) {
    console.error('❌ 加载活动失败:', error)
    // 可以添加错误提示
  } finally {
    loading.value = false
  }
}

// 打开凭证提交弹窗
const openProofModal = (task: Task) => {
  selectedTask.value = task
  proofText.value = ''
  showProofModal.value = true
}

// 任务状态文本
const getTaskStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    'unclaimed': '未领取',
    'in_progress': '进行中',
    'under_review': '审核中',
    'completed': '已完成',
    'rejected': '已驳回'
  }
  return statusMap[status] || '未知'
}

// 跳转到任务详情
const goToTaskDetail = (taskId: string) => {
  const router = useRouter()
  router.push(`/tasks/${taskId}`)
}

// 跳转到审核页面
const goToReview = (taskId: string) => {
  const router = useRouter()
  router.push(`/tasks/detail/review?id=${taskId}`)
}

// 提交凭证
const handleSubmitProof = async () => {
  if (!selectedTask.value || !proofText.value.trim()) return
  
  const result = await submitProof(selectedTask.value.id, proofText.value.trim())
  if (result.success) {
    alert(result.message)
    showProofModal.value = false
    // 重新加载我的任务
    await loadMyAllTasks()
  } else {
    alert(result.message)
  }
}

// 页面挂载时加载数据
onMounted(() => {
  console.log('📋 活动列表页面加载')
  loadActivities()
})

// 计算任务进度
const getTaskProgress = (task: Task): number => {
  const progressMap: Record<string, number> = {
    'unclaimed': 0,
    'in_progress': 33,
    'under_review': 66,
    'completed': 100,
    'rejected': 0
  }
  return progressMap[task.status] || 0
}

// 获取我的所有任务（包括发布的和领取的）
const loadMyAllTasks = async () => {
  try {
    const allTasks = await getAllTasks()
    const currentUserId = 1 // Mock: 当前用户ID，实际应从认证系统获取
    
    // 筛选我发布的任务和我领取的任务
    myTasks.value = allTasks.filter(task => 
      task.creatorId === currentUserId || task.claimerId === currentUserId
    )
  } catch (error) {
    console.error('加载我的任务失败:', error)
  }
}

// 任务状态轮询更新
let taskPollingInterval: ReturnType<typeof setInterval> | null = null

const startTaskPolling = () => {
  if (taskPollingInterval) {
    clearInterval(taskPollingInterval)
  }
  
  // 每5秒轮询一次任务状态
  taskPollingInterval = setInterval(async () => {
    if (showMyTasks.value) {
      await loadMyAllTasks()
    }
  }, 5000)
}

const stopTaskPolling = () => {
  if (taskPollingInterval) {
    clearInterval(taskPollingInterval)
    taskPollingInterval = null
  }
}

// 监听弹窗打开，重新加载我的任务
watch(showMyTasks, async (newValue) => {
  if (newValue) {
    await loadMyAllTasks()
    startTaskPolling()
  } else {
    stopTaskPolling()
  }
})

// 组件卸载时清理轮询
onUnmounted(() => {
  stopTaskPolling()
})
</script>

<style scoped>
/* 响应式网格调整 */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}
</style>

