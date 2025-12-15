<template>
  <div class="min-h-screen bg-mario-sky py-4 md:py-8">
    <div class="container mx-auto px-4 md:px-6 max-w-7xl">
      <!-- 返回按钮 -->
      <div class="mb-6">
        <PixelButton
          @click="navigateTo(`/community/${task.communityId}`)"
          variant="secondary"
          size="sm"
        >
          ← 返回社区
        </PixelButton>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="font-pixel text-lg text-white text-shadow-pixel animate-pulse">加载中...</div>
      </div>

      <!-- 任务详情 -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <!-- 任务基本信息 -->
        <div class="lg:col-span-2 space-y-4 md:space-y-6">
          <!-- 任务标题卡片 -->
          <PixelCard>
            <template #header>
              任务详情
            </template>
            <div class="space-y-4">
              <div>
                <h1 class="font-pixel text-xl md:text-2xl text-black mb-3 leading-tight">
                  {{ task.title || '加载中...' }}
                </h1>
                <div class="flex items-center gap-3 flex-wrap">
                  <span class="px-3 py-1.5 bg-mario-coin text-white border-2 border-black shadow-pixel-sm font-pixel text-[10px] uppercase">
                    {{ task.reward }} 积分
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
              
              <div v-if="task.requirements && task.requirements.length > 0" class="pt-4 border-t-2 border-black/20">
                <h3 class="font-pixel text-xs uppercase text-black mb-2">任务要求</h3>
                <ul class="font-vt323 text-lg text-black space-y-2 list-none pl-0">
                  <li v-for="(requirement, idx) in task.requirements" :key="idx" class="flex items-start gap-2">
                    <span class="text-mario-red font-pixel text-xs mt-1">■</span>
                    <span>{{ requirement }}</span>
                  </li>
                </ul>
              </div>
              
              <div class="pt-4 border-t-2 border-black/20">
                <h3 class="font-pixel text-xs uppercase text-black mb-2">提交说明</h3>
                <p class="font-vt323 text-lg text-black leading-relaxed">{{ task.submissionInstructions }}</p>
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
                  v-if="index < task.updates.length - 1"
                  class="absolute left-3 top-6 w-0.5 h-8 bg-black"
                ></div>
                
                <!-- 时间线节点 -->
                <div class="flex items-start gap-3">
                  <div class="flex-shrink-0 w-6 h-6 bg-mario-red border-2 border-black shadow-pixel-sm flex items-center justify-center -ml-8">
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
                      <div class="w-2 h-2 bg-mario-red border border-black animate-pulse"></div>
                      <span class="font-vt323 text-sm text-mario-red">实时更新中...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </PixelCard>
        </div>

        <!-- 任务信息和操作 -->
        <div class="space-y-4 md:space-y-6">
          <!-- 任务信息卡片 -->
          <PixelCard>
            <template #header>
              任务信息
            </template>
            <div class="space-y-3 font-vt323 text-base">
              <div class="flex justify-between items-center pb-2 border-b border-black/10">
                <span class="text-black/70">截止时间:</span>
                <span class="text-black font-medium">{{ formatDate(task.deadline) }}</span>
              </div>
              <div class="flex justify-between items-center pb-2 border-b border-black/10">
                <span class="text-black/70">创建者:</span>
                <span class="text-black font-medium">{{ task.creator }}</span>
              </div>
              <div class="pb-2 border-b border-black/10">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-black/70">参与者:</span>
                  <span class="text-black font-medium">{{ task.participants }}/{{ task.maxParticipants }} 人</span>
                </div>
                <div class="mt-2 space-y-2">
                  <div v-if="task.participantsList && task.participantsList.length > 0">
                    <div
                      v-for="participant in task.participantsList"
                      :key="participant.id"
                      @click="navigateToMember(participant.id)"
                      class="flex items-center gap-2 p-2 bg-white border-2 border-black shadow-pixel-sm hover:-translate-y-0.5 hover:shadow-pixel transition-all cursor-pointer"
                    >
                      <div class="w-8 h-8 bg-mario-red border-2 border-black flex items-center justify-center font-pixel text-xs text-white">
                        {{ participant.name.charAt(0) }}
                      </div>
                      <div class="flex-1">
                        <div class="font-vt323 text-sm text-black font-medium">{{ participant.name }}</div>
                        <div class="font-vt323 text-xs text-black/60">{{ participant.role }}</div>
                      </div>
                      <span class="font-pixel text-[8px]">→</span>
                    </div>
                  </div>
                  <div v-else class="font-vt323 text-sm text-black/60 text-center py-2">
                    暂无参与者
                  </div>
                </div>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-black/70">难度:</span>
                <span class="text-black font-medium">{{ task.difficulty }}</span>
              </div>
            </div>
          </PixelCard>
          
          <!-- 操作按钮卡片 -->
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
                :disabled="loading"
              >
                {{ loading ? '领取中...' : '领取任务' }}
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
                v-if="task.status === 'under_review'"
                @click="reviewTask"
                variant="warning"
                size="lg"
                :block="true"
              >
                审核任务
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

    <!-- 固定悬浮提交按钮（当任务进行中时显示） -->
    <div 
      v-if="task.status === 'in_progress'"
      class="fixed bottom-6 right-6 z-50"
    >
      <PixelButton
        @click="submitTask"
        variant="success"
        size="lg"
        class="shadow-pixel-lg hover:scale-110 transition-transform"
      >
        <span class="font-pixel text-sm">提交任务</span>
      </PixelButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getTaskById, claimTask } from '~/utils/api'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})
import PixelCard from '~/components/pixel/PixelCard.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'

// 获取路由参数
const route = useRoute()
const router = useRouter()
const taskId = route.params.id as string  // UUID string
const toast = useToast()
const loading = ref(false)

// 任务数据
const task = ref<any>({
  id: taskId,
  title: '',
  description: '',
  reward: 0,
  status: 'unclaimed',
  deadline: '',
  creator: '',
  participants: 0,
  maxParticipants: 5,
  difficulty: '中等',
  communityId: 1,
  participantsList: [],
  requirements: [],
  submissionInstructions: '请按照任务要求完成并提交相关凭证。',
  updates: []
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
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
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
      deadline: taskData.createdAt, // 使用创建时间作为截止时间（实际应从任务数据获取）
      creator: taskData.creatorName || '发布者',
      participants: taskData.claimerId ? 1 : 0,
      maxParticipants: 5,
      difficulty: '中等',
      communityId: taskData.activityId || 1,
      participantsList: taskData.claimerId ? [{
        id: taskData.claimerId,
        name: taskData.claimerName || '接单者',
        role: '参与者'
      }] : [],
      requirements: taskData.description.split('\n').filter(r => r.trim()),
      submissionInstructions: '请按照任务要求完成并提交相关凭证。',
      updates: [],
      // 保存原始API数据字段用于时间线
      createdAt: taskData.createdAt,
      updatedAt: taskData.updatedAt,
      claimedAt: taskData.claimedAt,
      submittedAt: taskData.submittedAt,
      completedAt: taskData.completedAt
    }
    
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
