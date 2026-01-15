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
        <!-- 多人任务：参与者导航栏（仅创建者可见） -->
        <PixelCard 
          v-if="canReview && task.participantLimit && task.participantLimit > 1"
          class="mb-4"
        >
          <template #header>
            参与者列表 ({{ claimedParticipantsCount }}/{{ task.participantLimit }})
          </template>
          <div class="flex gap-2 overflow-x-auto pb-2">
            <button
              v-for="(participant, index) in task.participantsList"
              :key="participant.id || index"
              @click="switchParticipant(participant.id || task.id)"
              class="flex-shrink-0 px-4 py-2 border-2 border-black shadow-pixel-sm font-pixel text-xs uppercase transition-all"
              :class="currentParticipantId === (participant.id || task.id)
                ? 'bg-mario-blue text-white' 
                : 'bg-white text-black hover:bg-mario-yellow'"
            >
              {{ participant.name || '未领取' }}
              <span v-if="participant.status === 'completed'" class="ml-1">✓</span>
              <span v-else-if="participant.status === 'rejected'" class="ml-1">✗</span>
              <span v-else-if="participant.submittedAt" class="ml-1">📤</span>
              <span v-else-if="participant.claimedAt" class="ml-1">📋</span>
            </button>
          </div>
        </PixelCard>
        
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
                    {{ task.startDate ? formatDate(task.startDate) : '未设置' }}
                  </span>
                </div>
                <div class="flex justify-between items-center pb-2 border-b border-black/10">
                  <span class="text-black/70">报名截止时间:</span>
                  <span class="text-black font-medium">{{ task.deadline ? formatDate(task.deadline) : '未设置' }}</span>
                </div>
                <div class="flex justify-between items-center pb-2 border-b border-black/10">
                  <span class="text-black/70">提交截止时间:</span>
                  <span class="text-black font-medium">{{ task.submitDeadline ? formatDate(task.submitDeadline) : (task.deadline ? formatDate(task.deadline) : '未设置') }}</span>
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
                      {{ getStatusText(update.status, task) }}
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
            <!-- 未领取状态 - 显示领取按钮或满员提示 -->
            <PixelButton
              v-if="task.status === 'unclaimed' && canClaim"
              @click="handleClaimTask"
              variant="primary"
              size="lg"
              :block="true"
              :disabled="loading || !isTaskStarted || isTaskExpired"
            >
              {{ loading ? '领取中...' : (isTaskExpired ? '已过期' : (isTaskStarted ? '领取任务' : '待任务开始')) }}
            </PixelButton>
            
            <!-- 领取错误提示 -->
            <div
              v-if="claimError"
              class="text-center py-4 bg-red-50 border-2 border-red-300 rounded"
            >
              <p class="font-vt323 text-base text-red-600">
                {{ claimError }}
              </p>
            </div>
            
            <!-- 任务已指定给其他用户提示 -->
            <div
              v-if="task.status === 'unclaimed' && !canClaim && task.assignedUserId && task.assignedUserId !== userStore.user?.id && !claimError"
              class="text-center py-4"
            >
              <p class="font-vt323 text-base text-black/60">
                此任务已指定给其他用户，您无法领取
              </p>
            </div>
            
            <!-- 多人任务未领完提示 -->
            <div
              v-if="task.status === 'unclaimed' && !canClaim && (!task.assignedUserId || task.assignedUserId === userStore.user?.id) && task.participantLimit && task.participantLimit > 1"
              class="text-center py-4"
            >
              <p class="font-vt323 text-base text-black/60">
                {{ task.participantsList && task.participantsList.filter((p: any) => p.id && p.claimedAt).length >= task.participantLimit 
                  ? '任务参与人数已满' 
                  : '您已经领取过这个任务' }}
              </p>
            </div>
            
            <!-- 单人任务已被领取提示 -->
            <div
              v-if="task.status === 'unclaimed' && !canClaim && (!task.assignedUserId || task.assignedUserId === userStore.user?.id) && (!task.participantLimit || task.participantLimit === 1)"
              class="text-center py-4"
            >
              <p class="font-vt323 text-base text-black/60">
                该任务已被{{ task.claimerName || '其他用户' }}领取
              </p>
            </div>
            
            <!-- 已领取状态（新状态）- 只有领取者可以提交 -->
            <PixelButton
              v-if="task.status === 'claimed' && isClaimer"
              @click="submitTask"
              variant="success"
              size="lg"
              :block="true"
            >
              提交任务
            </PixelButton>
            
            <!-- 已领取但未提交状态（新状态）- 只有领取者可以提交 -->
            <PixelButton
              v-if="task.status === 'unsubmit' && isClaimer"
              @click="submitTask"
              variant="success"
              size="lg"
              :block="true"
              :disabled="isTaskOverdue"
            >
              {{ isTaskOverdue ? '已截止' : '提交任务' }}
            </PixelButton>
            
            <!-- 已领取但非领取者查看 - 显示提示 -->
            <div
              v-if="(task.status === 'claimed' || task.status === 'unsubmit') && !isClaimer && task.claimerId"
              class="text-center py-4"
            >
              <p class="font-vt323 text-base text-black/60">
                此任务已被{{ task.claimerName || '其他用户' }}领取
              </p>
            </div>
            
            
            <!-- 已提交状态（新状态） -->
            <PixelButton
              v-if="task.status === 'submitted' && canReview"
              @click="reviewTask"
              variant="warning"
              size="lg"
              :block="true"
            >
              审核任务
            </PixelButton>
            
            <PixelButton
              v-if="task.status === 'submitted' && !canReview"
              variant="secondary"
              size="lg"
              :block="true"
              :disabled="true"
            >
              等待审核
            </PixelButton>
            
            <!-- 待审核状态 -->
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
            
            <!-- 已完成状态 -->
            <PixelButton
              v-if="task.status === 'completed'"
              variant="secondary"
              size="lg"
              :block="true"
              :disabled="true"
            >
              已完成
            </PixelButton>
            
            <!-- 已驳回状态 -->
            <PixelButton
              v-if="task.status === 'rejected'"
              variant="secondary"
              size="lg"
              :block="true"
              :disabled="true"
            >
              已驳回
            </PixelButton>
          </div>
        </PixelCard>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { getTaskById, claimTask, getApiBaseUrl } from '~/utils/api'
import { useToast } from '~/composables/useToast'
import { useUserStore } from '~/stores/user'
import PixelCard from '~/components/pixel/PixelCard.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'
import { getTaskRewardSymbol } from '~/utils/display'

// 获取路由参数
const route = useRoute()
const router = useRouter()
const taskId = route.params.id as string  // UUID是字符串，不需要parseInt
const toast = useToast()
const loading = ref(false)
const claimError = ref<string | null>(null)
const userStore = useUserStore()
const taskRewardSymbol = ref('积分') // 任务奖励的积分符号

// 当前查看的参与者ID（用于多人任务导航）
const currentParticipantId = ref<string>(taskId)

// 任务数据
const task = ref<any>({
  id: taskId,
  title: '',
  description: '',
  reward: 0,
  status: 'unclaimed',
  deadline: '',
  submitDeadline: '',
  startDate: '',
  creator: '',
  creatorId: '',  // ✅ 改为空字符串，因为creatorId是UUID (string)
  participantsList: [],
  submissionInstructions: '',
  proofConfig: null,
  updates: []
})

// 权限检查：判断当前用户是否是任务创建者
const canReview = computed(() => {
  return userStore.user?.id === task.value.creatorId
})

// 权限检查：判断当前用户是否是任务领取者
const isClaimer = computed(() => {
  return userStore.user?.id === task.value.claimerId
})

// 计算已领取的参与者数量
const claimedParticipantsCount = computed(() => {
  if (!task.value.participantsList || task.value.participantsList.length === 0) {
    return 0
  }
  return task.value.participantsList.filter((p: any) => p.id && p.claimedAt).length
})

// 检查任务是否可以领取（多人任务：检查是否还有未领取的位置）
const canClaim = computed(() => {
  // 如果任务已过期或未开始，不能领取
  if (isTaskExpired.value || !isTaskStarted.value) {
    return false
  }
  
  // 检查是否指定了参与人员
  if (task.value.assignedUserId) {
    // 如果指定了参与人员，只有该用户才能领取
    if (task.value.assignedUserId !== userStore.user?.id) {
      return false
    }
  }
  
  // 如果是多人任务
  if (task.value.participantLimit && task.value.participantLimit > 1) {
    // 检查当前用户是否已经领取过
    if (task.value.participantsList && task.value.participantsList.length > 0) {
      const userClaimed = task.value.participantsList.some(
        (p: any) => p.id === userStore.user?.id && p.claimedAt
      )
      if (userClaimed) {
        return false // 用户已经领取过
      }
    }
    
    // 检查是否还有未领取的位置
    const claimedCount = task.value.participantsList?.filter(
      (p: any) => p.id && p.claimedAt
    ).length || 0
    
    return claimedCount < task.value.participantLimit
  } else {
    // 单人任务：检查是否已被领取
    return !task.value.claimerId
  }
})

// 检查任务是否已开始
const isTaskStarted = computed(() => {
  if (!task.value.startDate) return true // 如果没有开始时间，默认认为已开始（向后兼容）
  const now = new Date()
  const startDate = new Date(task.value.startDate)
  return now >= startDate
})

// 检查任务是否已过期（过了报名截止日期且未领取）
const isTaskExpired = computed(() => {
  if (!task.value.deadline) return false // 如果没有报名截止时间，认为未过期
  const now = new Date()
  const deadline = new Date(task.value.deadline)
  // 过了报名截止日期且未领取的任务才算过期
  return now > deadline && !task.value.claimerId
})

// 检查任务是否已截止（过了提交截止日期且已领取但未提交）
const isTaskOverdue = computed(() => {
  if (!task.value.submitDeadline) return false // 如果没有提交截止时间，认为未截止
  const now = new Date()
  const submitDeadline = new Date(task.value.submitDeadline)
  // 过了提交截止日期且已领取但未提交的任务才算已截止
  return now > submitDeadline && !!task.value.claimerId && task.value.status !== 'completed' && task.value.status !== 'submitted' && task.value.status !== 'under_review'
})

// 状态类型
type TaskStatus = 'unclaimed' | 'claimed' | 'unsubmit' | 'submitted' | 'under_review' | 'completed' | 'rejected'

// 状态文本（统一的状态文本映射）
const getStatusText = (status: string, task?: any): string => {
  const statusMap: Record<string, string> = {
    'unclaimed': '未领取',
    'claimed': '已领取',
    'unsubmit': '待提交',
    'submitted': '已提交',
    'completed': '已完成',
    'under_review': '审核中',
    'rejected': '已终止'
  }
  return statusMap[status] || '未知'
}

// 状态样式类（用于时间线）
const getStatusClass = (status: string): string => {
  const statusClassMap: Record<string, string> = {
    'completed': 'bg-success/10 text-success',
    'unsubmit': 'bg-primary/10 text-primary',
    'claimed': 'bg-primary/10 text-primary',
    'under_review': 'bg-warning/10 text-warning',
    'rejected': 'bg-destructive/10 text-destructive'
  }
  return statusClassMap[status] || 'bg-muted/10 text-muted-foreground'
}

// 状态徽章样式类（像素风格）
const getStatusBadgeClass = (status: string): string => {
  const statusClassMap: Record<TaskStatus, string> = {
    'unclaimed': 'bg-white text-black',
    'unsubmit': 'bg-mario-yellow text-black',
    'claimed': 'bg-mario-yellow text-black',
    'submitted': 'bg-mario-yellow text-black',
    'completed': 'bg-mario-green text-white',
    'under_review': 'bg-mario-yellow text-black',
    'rejected': 'bg-black text-white'
  }
  return statusClassMap[status as TaskStatus] || 'bg-white text-black'
}

// 格式化日期
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '未设置'
  
  let date: Date
  
  // 处理 YYYY-MM-DDTHH:mm 格式（没有时区信息）
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dateString)) {
    // 直接解析为本地时间，不进行时区转换
    const [datePart, timePart] = dateString.split('T')
    const [year, month, day] = datePart.split('-').map(Number)
    const [hour, minute] = timePart.split(':').map(Number)
    date = new Date(year, month - 1, day, hour, minute)
  } else {
    // 标准 ISO 格式或数据库时间戳
    date = new Date(dateString)
  }
  
  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return '未设置'
  }
  
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
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
// 优先使用任务的时间线字段（timeline），如果不存在则根据任务状态生成
const updateTimeline = () => {
  // 如果任务有 timeline 字段，直接使用（这是后端维护的仅追加写入的时间线）
  if (task.value.timeline && Array.isArray(task.value.timeline) && task.value.timeline.length > 0) {
    console.log('Using timeline from database:', task.value.timeline)
    
    // 按时间戳排序，确保时间线按时间顺序显示
    const sortedTimeline = [...task.value.timeline].sort((a: any, b: any) => {
      const timeA = new Date(a.timestamp || a.created_at || 0).getTime()
      const timeB = new Date(b.timestamp || b.created_at || 0).getTime()
      return timeA - timeB
    })
    
    task.value.updates = sortedTimeline.map((statusItem: any, index: number) => {
      // 处理字段名称兼容性
      const actorName = statusItem.actorName || statusItem.actor_name || ''
      const action = statusItem.action || ''
      const reason = statusItem.reason || statusItem.reject_reason || ''
      const timestamp = statusItem.timestamp || statusItem.created_at || new Date().toISOString()
      
      // 根据状态值生成显示文本
      let title = ''
      let description = ''
      let status = statusItem.status || 'completed'
      
      // 根据状态和操作生成显示文本
      switch (statusItem.status) {
        case 'unclaimed':
          title = action || (index === 0 ? '任务创建' : '任务状态')
          description = action === '创建任务' 
            ? `任务已创建，等待领取${actorName ? `（创建者：${actorName}）` : ''}`
            : action === '重新发布'
            ? `任务已重新发布，等待领取${actorName ? `（操作者：${actorName}）` : ''}${reason ? `，原因：${reason}` : ''}`
            : '任务未领取'
          break
        case 'claimed':
          title = action || '任务领取'
          description = action === '领取任务'
            ? `任务已被${actorName || '参与者'}领取`
            : `任务状态：已领取${actorName ? `（操作者：${actorName}）` : ''}`
          break
        case 'unsubmit':
          title = action || '任务状态'
          description = action === '领取任务'
            ? `任务已被${actorName || '参与者'}领取，等待提交`
            : action === '重新提交'
            ? `任务已重新提交，等待提交凭证${actorName ? `（操作者：${actorName}）` : ''}${reason ? `，原因：${reason}` : ''}`
            : '任务待提交'
          break
        case 'submitted':
          title = action || '凭证提交'
          description = `任务完成凭证已提交，等待审核${actorName ? `（提交者：${actorName}）` : ''}`
          break
        case 'under_review':
          title = action || '凭证提交'
          description = `任务完成凭证已提交，等待审核${actorName ? `（提交者：${actorName}）` : ''}`
          break
        case 'completed':
          title = action || '审核通过'
          description = `任务审核通过，奖励已发放${actorName ? `（审核者：${actorName}）` : ''}${reason ? `，审核意见：${reason}` : ''}`
          break
        case 'resubmit':
          title = action || '审核驳回'
          description = `审核未通过，需要重新提交${actorName ? `（审核者：${actorName}）` : ''}${reason ? `，驳回原因：${reason}` : ''}`
          status = 'unsubmit' // 显示为待提交状态
          break
        case 'reclaim':
          title = action || '审核驳回'
          description = `审核未通过，需要重新领取任务${actorName ? `（审核者：${actorName}）` : ''}${reason ? `，驳回原因：${reason}` : ''}`
          status = 'unclaimed' // 显示为未领取状态
          break
        case 'rejected':
          title = action || '审核驳回'
          description = `任务审核未通过，已驳回${actorName ? `（审核者：${actorName}）` : ''}${reason ? `，驳回原因：${reason}` : ''}`
          break
        default:
          title = action || '状态更新'
          description = reason || '状态已更新'
      }
      
      return {
        id: `${index}-${statusItem.status}-${timestamp}`,
        title,
        description,
        timestamp,
        status,
        actorName,
        action,
        reason
      }
    })
    console.log('Generated updates from timeline:', task.value.updates)
    return
  }
  
  console.log('No timeline found, generating from task status')
  
  // 如果没有 timeline 字段，根据任务状态生成（向后兼容）
  const updates: any[] = []
  
  // 任务创建
  updates.push({
    id: '1',
    title: '任务创建',
    description: '任务已创建，等待领取',
    timestamp: task.value.createdAt || new Date().toISOString(),
    status: 'completed'
  })
  
  // 任务领取（多人任务需要显示所有领取者）
  if (task.value.participantsList && task.value.participantsList.length > 0) {
    task.value.participantsList.forEach((participant: any, index: number) => {
      updates.push({
        id: `2-${index}`,
        title: '任务领取',
        description: `任务已被${participant.name}领取`,
        timestamp: participant.claimedAt || task.value.claimedAt || new Date().toISOString(),
        status: 'completed'
      })
    })
  } else if (['claimed', 'unsubmit', 'submitted', 'under_review', 'completed'].includes(task.value.status)) {
    updates.push({
      id: '2',
      title: '任务领取',
      description: '任务已被领取，开始执行',
      timestamp: task.value.claimedAt || new Date().toISOString(),
      status: 'completed'
    })
  }
  
  // 凭证提交（多人任务需要显示所有提交者）
  if (task.value.participantsList && task.value.participantsList.length > 0) {
    task.value.participantsList.forEach((participant: any, index: number) => {
      if (participant.submittedAt) {
        updates.push({
          id: `3-${index}`,
          title: '凭证提交',
          description: `任务完成凭证已由${participant.name}提交，等待审核`,
          timestamp: participant.submittedAt,
          status: 'completed'
        })
      }
    })
  } else if (['under_review', 'completed'].includes(task.value.status)) {
    updates.push({
      id: '3',
      title: '凭证提交',
      description: '任务完成凭证已提交，等待审核',
      timestamp: task.value.submittedAt || new Date().toISOString(),
      status: 'completed'
    })
  }
  
  // 审核结果
  if (task.value.status === 'completed') {
    updates.push({
      id: '4',
      title: '审核通过',
      description: '任务审核通过，奖励已发放',
      timestamp: task.value.completedAt || new Date().toISOString(),
      status: 'completed'
    })
  } else if (task.value.status === 'rejected') {
    // 根据 rejectOption 显示不同的文本
    const rejectOption = (task.value as any).rejectOption
    if (rejectOption === 'rejected') {
      updates.push({
        id: '4',
        title: '审核驳回',
        description: '任务审核未通过，已驳回',
        timestamp: task.value.updatedAt || new Date().toISOString(),
        status: 'rejected'
      })
    } else if (rejectOption === 'resubmit') {
      updates.push({
        id: '4',
        title: '审核未通过',
        description: '审核未通过，重新提交',
        timestamp: task.value.updatedAt || new Date().toISOString(),
        status: 'unsubmit'
      })
    } else if (rejectOption === 'reclaim') {
      updates.push({
        id: '4',
        title: '审核未通过',
        description: '审核未通过，重新领取任务',
        timestamp: task.value.updatedAt || new Date().toISOString(),
        status: 'unclaimed'
      })
    } else {
      // 默认情况
    updates.push({
        id: '4',
      title: '审核驳回',
      description: '任务审核未通过，已驳回',
      timestamp: task.value.updatedAt || new Date().toISOString(),
      status: 'rejected'
    })
    }
  }
  
  // 如果任务正在进行中，添加实时更新标记
  if (task.value.status === 'claimed' || task.value.status === 'unsubmit') {
    updates.push({
      id: Date.now().toString(),
      title: '任务进行中',
      description: '任务正在进行中，等待提交...',
      timestamp: new Date().toISOString(),
      status: 'unsubmit',
      isRealTime: true
    })
  }
  
  task.value.updates = updates
}

// 加载任务详情
const loadTask = async () => {
  loading.value = true
  claimError.value = null // 清除之前的错误消息
  try {
    const baseUrl = getApiBaseUrl()
    const taskData = await getTaskById(taskId, baseUrl)
    if (!taskData) {
      toast.add({
        title: '任务不存在',
        description: '无法找到该任务',
        color: 'red'
      })
      router.push('/tasks')
      return
    }
    
    // 处理任务组格式（多人任务）
    let participantsList: any[] = []
    let currentTaskData = taskData
    
    if (taskData.participantsList && Array.isArray(taskData.participantsList) && taskData.participantsList.length > 0) {
      // 多人任务：使用 participantsList
      participantsList = taskData.participantsList
      
      // 如果当前用户是创建者，默认显示第一个参与者
      // 否则显示当前用户领取的任务
      if (userStore.user?.id === taskData.creatorId) {
        // 创建者：显示第一个已领取的参与者，或第一个参与者
        const firstClaimed = participantsList.find((p: any) => p.id && p.claimedAt) || participantsList[0]
        currentTaskData = await getTaskById(firstClaimed.id || taskData.id, baseUrl) || taskData
        currentParticipantId.value = firstClaimed.id || taskData.id
      } else {
        // 非创建者：显示自己领取的任务
        const myTask = participantsList.find((p: any) => p.id && userStore.user?.id === p.id)
        if (myTask) {
          currentTaskData = await getTaskById(myTask.id, baseUrl) || taskData
          currentParticipantId.value = myTask.id
        } else {
          currentParticipantId.value = taskData.id
        }
      }
    } else {
      // 单人任务
      participantsList = taskData.claimerId ? [{
        id: taskData.id,
        name: taskData.claimerName || '接单者',
        role: '参与者',
        claimedAt: taskData.claimedAt,
        submittedAt: taskData.submittedAt,
        status: taskData.status
      }] : []
      currentParticipantId.value = taskData.id
    }
    
    // 转换API数据为页面需要的格式
    task.value = {
      id: currentTaskData.id,
      title: currentTaskData.title || taskData.title,
      description: currentTaskData.description || taskData.description,
      reward: currentTaskData.reward || taskData.reward,
      status: currentTaskData.status || taskData.status,
      deadline: currentTaskData.deadline || taskData.deadline || currentTaskData.createdAt, // 报名截止日期
      submitDeadline: currentTaskData.submitDeadline || taskData.submitDeadline || currentTaskData.deadline || currentTaskData.createdAt, // 提交截止日期
      startDate: currentTaskData.startDate || taskData.startDate, // 报名开始日期
      isClaimed: !!currentTaskData.claimerId, // 是否已领取（通过 claimerId 判断）
      creator: currentTaskData.creatorName || taskData.creatorName || '发布者',
      creatorId: currentTaskData.creatorId || taskData.creatorId,
      participantLimit: taskData.participantLimit || null, // 保存多人任务限制
      claimerId: currentTaskData.claimerId || null, // 保存当前查看的领取者ID，用于权限检查
      claimerName: currentTaskData.claimerName || null, // 保存当前查看的领取者名称，用于显示
      assignedUserId: currentTaskData.assignedUserId || taskData.assignedUserId || null, // 指定参与人员ID
      participantsList: participantsList, // 保存所有参与者列表
      submissionInstructions: currentTaskData.submissionInstructions || taskData.submissionInstructions || '',
      proofConfig: currentTaskData.proofConfig || taskData.proofConfig || null, // 获取证明配置
      timeline: currentTaskData.timeline || [], // 保存当前参与者的时间线数据
      updates: [],
      // 保存原始API数据字段用于时间线
      createdAt: currentTaskData.createdAt || taskData.createdAt,
      updatedAt: currentTaskData.updatedAt || taskData.updatedAt,
      claimedAt: currentTaskData.claimedAt,
      submittedAt: currentTaskData.submittedAt,
      completedAt: currentTaskData.completedAt
    }
    
    // 调试：打印 assignedUserId
    console.log('[LOAD TASK] assignedUserId:', {
      currentTaskData: currentTaskData.assignedUserId,
      taskData: taskData.assignedUserId,
      final: task.value.assignedUserId,
      currentUserId: userStore.user?.id
    })
    
    // 调试：打印时间线数据
    console.log('Task timeline data loaded:', task.value.timeline)
    
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

// 切换参与者（多人任务）
const switchParticipant = async (participantTaskId: string) => {
  if (currentParticipantId.value === participantTaskId) return
  
  currentParticipantId.value = participantTaskId
  loading.value = true
  
  try {
    const baseUrl = getApiBaseUrl()
    const participantTaskData = await getTaskById(participantTaskId, baseUrl)
    
    if (participantTaskData) {
      // 更新当前显示的任务数据
      task.value.id = participantTaskData.id
      task.value.status = participantTaskData.status
      task.value.claimerId = participantTaskData.claimerId
      task.value.claimerName = participantTaskData.claimerName
      task.value.reward = participantTaskData.reward
      task.value.timeline = participantTaskData.timeline || []
      task.value.claimedAt = participantTaskData.claimedAt
      task.value.submittedAt = participantTaskData.submittedAt
      task.value.completedAt = participantTaskData.completedAt
      
      // 更新任务奖励的积分符号
      taskRewardSymbol.value = await getTaskRewardSymbol(participantTaskData)
      
      // 重新生成时间线
      updateTimeline()
    }
  } catch (error) {
    console.error('切换参与者失败:', error)
    toast.add({
      title: '切换失败',
      description: '无法加载参与者信息',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

// 领取任务
const handleClaimTask = async () => {
  claimError.value = null // 清除之前的错误
  loading.value = true
  
  try {
    const baseUrl = getApiBaseUrl()
    const result = await claimTask(taskId, baseUrl)
    if (result.success) {
      toast.add({
        title: '领取成功',
        description: result.message,
        color: 'green'
      })
      // 重新加载任务数据
      await loadTask()
    } else {
      // 显示错误消息在页面上
      claimError.value = result.message || '领取失败'
      toast.add({
        title: '领取失败',
        description: result.message,
        color: 'red'
      })
    }
  } catch (error: any) {
    console.error('领取任务失败:', error)
    const errorMessage = error?.message || '网络错误，请稍后重试'
    claimError.value = errorMessage
    toast.add({
      title: '领取失败',
      description: errorMessage,
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

// 提交任务
const submitTask = () => {
      router.push(`/tasks/submit?id=${taskId}`)
}

// 审核任务
const reviewTask = () => {
      // 使用当前查看的参与者任务ID
      router.push(`/tasks/review?id=${currentParticipantId.value}`)
}

// 导航到成员页面
const navigateToMember = (memberId: string | number) => {
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
  
  // 每10秒轮询一次任务状态（减少频率，避免过度刷新）
  pollingInterval = setInterval(async () => {
    try {
      // 只在任务未完成时轮询
      if (task.value.status === 'completed' || task.value.status === 'rejected') {
        return // 任务已完成，停止轮询
      }
      
      const baseUrl = getApiBaseUrl()
      const updatedTask = await getTaskById(taskId, baseUrl)
      if (updatedTask && updatedTask.status !== task.value.status) {
        // 状态发生变化，重新加载任务
        await loadTask()
      }
    } catch (error) {
      console.error('轮询任务状态失败:', error)
    }
  }, 10000) // 改为10秒，减少刷新频率
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
