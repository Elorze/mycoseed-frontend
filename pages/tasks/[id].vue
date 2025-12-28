<template>
  <div class="min-h-screen bg-mario-sky py-4 md:py-8">
    <div class="container mx-auto px-4 md:px-6 max-w-7xl">
      <!-- 返回按钮 -->
      <div class="mb-6">
        <PixelButton
          @click="navigateTo('/tasks')"
          variant="secondary"
          size="sm"
        >
          ← 返回市集
        </PixelButton>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="font-pixel text-lg text-white text-shadow-pixel animate-pulse">加载中...</div>
      </div>

      <!-- 任务详情 -->
      <div v-else class="space-y-4 md:space-y-6">
        <!-- 任务介绍 -->
        <PixelCard>
          <template #header>
            任务介绍
          </template>
          <div class="space-y-4">
            <div class="flex items-start justify-between gap-4 flex-wrap">
              <h1 class="font-pixel text-xl md:text-2xl text-black leading-tight flex-1 min-w-0">
                {{ task.title || '加载中...' }}
              </h1>
              <div class="flex items-center gap-3 flex-wrap">
                <span class="px-3 py-1.5 bg-mario-coin text-white border-2 border-black shadow-pixel-sm font-pixel text-[10px] uppercase">
                  {{ task.reward }} {{ taskRewardSymbol }}
                </span>
                <span 
                  class="px-3 py-1.5 border-2 border-black shadow-pixel-sm font-pixel text-[10px] uppercase"
                  :class="getStatusBadgeClass(task.status)"
                >
                  {{ getStatusText(task.status) }}
                </span>
              </div>
            </div>
            
            <div class="pt-4 border-t-2 border-black/20">
              <h3 class="font-pixel text-xs uppercase text-black mb-2">任务描述</h3>
              <p class="font-vt323 text-lg text-black leading-relaxed">{{ task.description }}</p>
            </div>
            
            <div v-if="task.proofConfig" class="pt-4 border-t-2 border-black/20">
              <h3 class="font-pixel text-xs uppercase text-black mb-4">提交要求</h3>
              <div class="space-y-3">
                <!-- 照片证据 -->
                <div v-if="task.proofConfig.photo?.enabled" class="p-3 bg-gray-50 border-2 border-black shadow-pixel-sm">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-xl">📷</span>
                    <h4 class="font-pixel text-xs uppercase text-black">照片证据</h4>
                  </div>
                  <div class="font-vt323 text-base text-black space-y-1">
                    <div>数量要求：{{ task.proofConfig.photo.count }}张</div>
                    <div v-if="task.proofConfig.photo.requirements" class="mt-2">
                      <span class="font-pixel text-[10px] uppercase text-black/70">要求说明：</span>
                      <p class="mt-1">{{ task.proofConfig.photo.requirements }}</p>
                    </div>
                  </div>
                </div>

                <!-- 位置定位 -->
                <div v-if="task.proofConfig.gps?.enabled" class="p-3 bg-gray-50 border-2 border-black shadow-pixel-sm">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-xl">📍</span>
                    <h4 class="font-pixel text-xs uppercase text-black">位置定位</h4>
                  </div>
                </div>

                <!-- 文字描述 -->
                <div v-if="task.proofConfig.description?.enabled" class="p-3 bg-gray-50 border-2 border-black shadow-pixel-sm">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-xl">📝</span>
                    <h4 class="font-pixel text-xs uppercase text-black">文字描述</h4>
                  </div>
                  <div class="font-vt323 text-base text-black space-y-1">
                    <div>最少字数：{{ task.proofConfig.description.minWords || 10 }}字</div>
                    <div v-if="task.proofConfig.description.prompt" class="mt-2">
                      <span class="font-pixel text-[10px] uppercase text-black/70">提示语：</span>
                      <p class="mt-1">{{ task.proofConfig.description.prompt }}</p>
                    </div>
                  </div>
                </div>

                <!-- 如果没有配置任何提交要求 -->
                <div v-if="!hasAnyProofConfig(task.proofConfig)" class="font-vt323 text-base text-black/60">
                  未设置提交要求
                </div>
              </div>
            </div>
            
            <div class="pt-4 border-t-2 border-black/20">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 font-vt323 text-base">
                <div class="flex justify-between items-center pb-2 border-b border-black/10">
                  <span class="text-black/70">发布者:</span>
                  <span class="text-black font-medium">{{ task.creator }}</span>
                </div>
                <div class="flex justify-between items-center pb-2 border-b border-black/10">
                  <span class="text-black/70">报名开始时间:</span>
                  <span class="text-black font-medium">
                    {{ task.claimedAt ? formatDate(task.claimedAt) : (task.startDate ? formatDate(task.startDate) : '未开始') }}
                  </span>
                </div>
                <div class="flex justify-between items-center pb-2 border-b border-black/10">
                  <span class="text-black/70">提交截止时间:</span>
                  <span class="text-black font-medium">{{ formatDate(task.deadline) }}</span>
                </div>
              </div>
            </div>
            
            <div v-if="task.submissionInstructions && task.submissionInstructions.trim()" class="pt-4 border-t-2 border-black/20">
              <h3 class="font-pixel text-xs uppercase text-black mb-2">提交说明</h3>
              <p class="font-vt323 text-lg text-black leading-relaxed">
                {{ task.submissionInstructions }}
              </p>
            </div>
          </div>
        </PixelCard>

        <!-- 任务进度 -->
        <PixelCard v-if="task.updates && task.updates.length > 0">
          <template #header>
            任务进度
          </template>
          <div class="space-y-4">
            <div
              v-for="(update, index) in task.updates"
              :key="update.id"
              class="relative pl-8"
            >
              <!-- 时间线连接线 -->
              <div 
                v-if="Number(index) < task.updates.length - 1"
                class="absolute left-3 top-6 w-0.5 h-8 bg-mario-blue"
              ></div>
              
              <!-- 时间线节点 -->
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0 w-6 h-6 bg-mario-blue border-2 border-black shadow-pixel-sm flex items-center justify-center -ml-8">
                  <div class="w-2 h-2 bg-white border border-black"></div>
                </div>
                
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1 flex-wrap">
                    <span class="font-pixel text-[10px] uppercase text-black">{{ update.title }}</span>
                    <span class="font-vt323 text-sm text-black/60">{{ formatDate(update.timestamp) }}</span>
                    <span 
                      v-if="update.status"
                      class="px-2 py-0.5 border border-black font-pixel text-[8px] uppercase"
                      :class="getStatusBadgeClass(update.status)"
                    >
                      {{ getStatusText(update.status) }}
                    </span>
                  </div>
                  <p class="font-vt323 text-base text-black">{{ update.description }}</p>
                  
                  <!-- 显示实时状态 -->
                  <div v-if="update.isRealTime" class="mt-2 flex items-center gap-2">
                    <div class="w-2 h-2 bg-mario-blue border border-black animate-pulse"></div>
                    <span class="font-vt323 text-sm text-mario-blue">实时更新中...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PixelCard>
        
        <!-- 操作按钮 -->
        <PixelCard>
          <template #header>
            操作
          </template>
          <div class="space-y-3">
            <PixelButton
              v-if="task.status === 'unclaimed'"
              @click="handleClaimTask"
              variant="primary"
              size="lg"
              :block="true"
              :disabled="loading || !isTaskStarted || isTaskExpired"
            >
              {{ loading ? '领取中...' : (isTaskExpired ? '已过期' : (isTaskStarted ? '领取任务' : '待任务开始')) }}
            </PixelButton>
            
            <PixelButton
              v-if="task.status === 'in_progress'"
              @click="submitTask"
              variant="success"
              size="lg"
              :block="true"
            >
              提交任务
            </PixelButton>
            
            <PixelButton
              v-if="task.status === 'under_review' && canReview"
              @click="reviewTask"
              variant="warning"
              size="lg"
              :block="true"
            >
              审核任务
            </PixelButton>
            
            <PixelButton
              v-if="task.status === 'under_review' && !canReview"
              variant="secondary"
              size="lg"
              :block="true"
              :disabled="true"
            >
              审核中
            </PixelButton>
            
            <PixelButton
              v-if="task.status === 'completed'"
              variant="secondary"
              size="lg"
              :block="true"
              :disabled="true"
            >
              已完成
            </PixelButton>
          </div>
        </PixelCard>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { getTaskById, claimTask } from '~/utils/api'
import { useToast } from '~/composables/useToast'
import { useUserStore } from '~/stores/user'
import PixelCard from '~/components/pixel/PixelCard.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'
import { getTaskRewardSymbol } from '~/utils/display'

// 获取路由参数
const route = useRoute()
const router = useRouter()
const taskId = parseInt(route.params.id as string)
const toast = useToast()
const loading = ref(false)
const userStore = useUserStore()
const taskRewardSymbol = ref('积分') // 任务奖励的积分符号

// 任务数据
const task = ref<any>({
  id: taskId,
  title: '',
  description: '',
  reward: 0,
  status: 'unclaimed',
  deadline: '',
  startDate: '',
  creator: '',
  creatorId: 0,
  participantsList: [],
  submissionInstructions: '',
  proofConfig: null,
  updates: []
})

// 权限检查：判断当前用户是否是任务创建者
const canReview = computed(() => {
  return userStore.user?.id === task.value.creatorId
})

// 检查任务是否已开始
const isTaskStarted = computed(() => {
  if (!task.value.startDate) return true // 如果没有开始时间，默认认为已开始（向后兼容）
  const now = new Date()
  const startDate = new Date(task.value.startDate)
  return now >= startDate
})

// 检查任务是否已过期
const isTaskExpired = computed(() => {
  if (!task.value.deadline) return false // 如果没有截止时间，认为未过期
  const now = new Date()
  const deadline = new Date(task.value.deadline)
  return now > deadline
})

// 状态类型
type TaskStatus = 'unclaimed' | 'in_progress' | 'completed' | 'under_review' | 'rejected'

// 状态文本
const getStatusText = (status: string): string => {
  const statusMap: Record<TaskStatus, string> = {
    'unclaimed': '未领取',
    'in_progress': '进行中',
    'completed': '已完成',
    'under_review': '审核中',
    'rejected': '已驳回'
  }
  return statusMap[status as TaskStatus] || '未知'
}

// 状态样式类（用于时间线）
const getStatusClass = (status: string): string => {
  const statusClassMap: Record<string, string> = {
    'completed': 'bg-success/10 text-success',
    'in_progress': 'bg-primary/10 text-primary',
    'under_review': 'bg-warning/10 text-warning',
    'rejected': 'bg-destructive/10 text-destructive'
  }
  return statusClassMap[status] || 'bg-muted/10 text-muted-foreground'
}

// 状态徽章样式类（像素风格）
const getStatusBadgeClass = (status: string): string => {
  const statusClassMap: Record<TaskStatus, string> = {
    'unclaimed': 'bg-white text-black',
    'in_progress': 'bg-mario-yellow text-black',
    'completed': 'bg-mario-green text-white',
    'under_review': 'bg-mario-yellow text-black',
    'rejected': 'bg-black text-white'
  }
  return statusClassMap[status as TaskStatus] || 'bg-white text-black'
}

// 格式化日期
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '未设置'
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 检查是否有任何证明配置
const hasAnyProofConfig = (proofConfig: any) => {
  if (!proofConfig) return false
  return (
    (proofConfig.photo?.enabled) ||
    (proofConfig.gps?.enabled) ||
    (proofConfig.description?.enabled)
  )
}

// 生成进度时间线
const updateTimeline = () => {
  const updates: any[] = []
  
  // 任务创建
  updates.push({
    id: 1,
    title: '任务创建',
    description: '任务已创建，等待领取',
    timestamp: task.value.createdAt || new Date().toISOString(),
    status: 'completed'
  })
  
  // 任务领取
  if (['in_progress', 'under_review', 'completed'].includes(task.value.status)) {
    updates.push({
      id: 2,
      title: '任务领取',
      description: task.value.participantsList.length > 0 
        ? `任务已被${task.value.participantsList[0].name}领取`
        : '任务已被领取，开始执行',
      timestamp: task.value.claimedAt || new Date().toISOString(),
      status: 'completed'
    })
  }
  
  // 凭证提交
  if (['under_review', 'completed'].includes(task.value.status)) {
    updates.push({
      id: 3,
      title: '凭证提交',
      description: '任务完成凭证已提交，等待审核',
      timestamp: task.value.submittedAt || new Date().toISOString(),
      status: 'completed'
    })
  }
  
  // 审核结果
  if (task.value.status === 'completed') {
    updates.push({
      id: 4,
      title: '审核通过',
      description: '任务审核通过，奖励已发放',
      timestamp: task.value.completedAt || new Date().toISOString(),
      status: 'completed'
    })
  } else if (task.value.status === 'rejected') {
    updates.push({
      id: 4,
      title: '审核驳回',
      description: '任务审核未通过，已驳回',
      timestamp: task.value.updatedAt || new Date().toISOString(),
      status: 'rejected'
    })
  }
  
  // 如果任务正在进行中，添加实时更新标记
  if (task.value.status === 'in_progress') {
    updates.push({
      id: Date.now(),
      title: '任务进行中',
      description: '任务正在进行中，等待提交...',
      timestamp: new Date().toISOString(),
      status: 'in_progress',
      isRealTime: true
    })
  }
  
  task.value.updates = updates
}

// 加载任务详情
const loadTask = async () => {
  loading.value = true
  try {
    const taskData = await getTaskById(taskId)
    if (!taskData) {
      toast.add({
        title: '任务不存在',
        description: '无法找到该任务',
        color: 'red'
      })
      router.push('/tasks')
      return
    }
    
    // 转换API数据为页面需要的格式
    task.value = {
      id: taskData.id,
      title: taskData.title,
      description: taskData.description,
      reward: taskData.reward,
      status: taskData.status,
      deadline: taskData.deadline || taskData.createdAt, // 使用截止日期，如果没有则使用创建时间作为后备
      startDate: taskData.startDate, // 保存开始日期
      creator: taskData.creatorName || '发布者',
      creatorId: taskData.creatorId,
      participantsList: taskData.claimerId ? [{
        id: taskData.claimerId,
        name: taskData.claimerName || '接单者',
        role: '参与者'
      }] : [],
      submissionInstructions: taskData.submissionInstructions || '',
      proofConfig: taskData.proofConfig || null, // 获取证明配置
      updates: [],
      // 保存原始API数据字段用于时间线
      createdAt: taskData.createdAt,
      updatedAt: taskData.updatedAt,
      claimedAt: taskData.claimedAt,
      submittedAt: taskData.submittedAt,
      completedAt: taskData.completedAt
    }
    
    // 获取任务奖励的积分符号
    taskRewardSymbol.value = await getTaskRewardSymbol(taskData)
    
    // 生成进度时间线
    updateTimeline()
  } catch (error) {
    console.error('加载任务失败:', error)
    toast.add({
      title: '加载失败',
      description: '无法加载任务详情，请稍后重试',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

// 领取任务
const handleClaimTask = async () => {
  try {
    const result = await claimTask(taskId)
    if (result.success) {
      toast.add({
        title: '领取成功',
        description: result.message,
        color: 'green'
      })
      // 重新加载任务数据
      await loadTask()
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

// 提交任务
const submitTask = () => {
  router.push(`/tasks/detail/submit?id=${taskId}`)
}

// 审核任务
const reviewTask = () => {
  router.push(`/tasks/detail/review?id=${taskId}`)
}

// 导航到成员页面
const navigateToMember = (memberId: number) => {
  router.push(`/member/${memberId}`)
}

// 导航函数
const navigateTo = (path: string) => {
  router.push(path)
}

// 进度更新轮询
let pollingInterval: ReturnType<typeof setInterval> | null = null

const startProgressPolling = () => {
  // 清除已有轮询
  if (pollingInterval) {
    clearInterval(pollingInterval)
  }
  
  // 每5秒轮询一次任务状态
  pollingInterval = setInterval(async () => {
    try {
      const updatedTask = await getTaskById(taskId)
      if (updatedTask && updatedTask.status !== task.value.status) {
        // 状态发生变化，重新加载任务
        await loadTask()
      }
    } catch (error) {
      console.error('轮询任务状态失败:', error)
    }
  }, 5000)
}

const stopProgressPolling = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }
}

// 组件挂载时加载任务并开始轮询
onMounted(async () => {
  // 确保用户信息已加载
  await userStore.getUser()
  
  await loadTask()
  
  // 检查是否从提交页面返回
  if (route.query.submitted === 'true') {
    // 重新加载任务以获取最新状态
    await loadTask()
    // 清理URL参数
    router.replace({ query: {} })
  }
  
  // 检查是否从审核页面返回
  if (route.query.reviewed === 'true') {
    // 重新加载任务以获取最新状态
    await loadTask()
    // 清理URL参数
    router.replace({ query: {} })
  }
  
  // 开始进度轮询
  startProgressPolling()
})

// 组件卸载时清理轮询
onUnmounted(() => {
  stopProgressPolling()
})
</script>

<style scoped>
</style>
