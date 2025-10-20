<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto px-6 py-8">
      <!-- 返回按钮 -->
      <div class="mb-8">
        <button
          @click="navigateTo('/dashboard?community=' + task.communityId)"
          class="mb-4 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group cursor-pointer"
        >
          <UIcon name="i-heroicons-arrow-left" class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span class="font-medium"></span>
        </button>
      </div>

      <!-- 任务详情 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 任务基本信息 -->
        <div class="lg:col-span-2">
          <div class="bg-card border border-border rounded-xl p-6">
            <div class="flex items-start justify-between mb-6">
              <div>
                <h1 class="text-3xl font-bold text-foreground mb-2">{{ task.title }}</h1>
                <div class="flex items-center gap-4">
                  <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {{ task.reward }} ETH
                  </span>
                  <span class="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
                    {{ getStatusText(task.status) }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="space-y-4">
              <div>
                <h3 class="text-lg font-semibold text-foreground mb-2">任务描述</h3>
                <p class="text-muted-foreground">{{ task.description }}</p>
              </div>
              
              <div>
                <h3 class="text-lg font-semibold text-foreground mb-2">任务要求</h3>
                <ul class="list-disc list-inside text-muted-foreground space-y-1">
                  <li v-for="requirement in task.requirements" :key="requirement">{{ requirement }}</li>
                </ul>
              </div>
              
              <div>
                <h3 class="text-lg font-semibold text-foreground mb-2">提交说明</h3>
                <p class="text-muted-foreground">{{ task.submissionInstructions }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 任务操作 -->
        <div class="space-y-4">
          <div class="bg-card border border-border rounded-xl p-6">
            <h3 class="text-lg font-bold text-foreground mb-4">任务信息</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-muted-foreground">截止时间:</span>
                <span class="text-foreground">{{ formatDate(task.deadline) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">创建者:</span>
                <span class="text-foreground">{{ task.creator }}</span>
              </div>
              <div>
                <span class="text-muted-foreground">参与者:</span>
                <div class="mt-2 space-y-2">
                  <div v-if="task.participantsList && task.participantsList.length > 0">
                    <div
                      v-for="participant in task.participantsList"
                      :key="participant.id"
                      @click="navigateToMember(participant.id)"
                      class="flex items-center gap-2 p-2 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                    >
                      <div class="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs text-white font-bold">
                        {{ participant.name.charAt(0) }}
                      </div>
                      <span class="text-sm text-foreground">{{ participant.name }}</span>
                      <span class="text-xs text-muted-foreground">{{ participant.role }}</span>
                      <UIcon name="i-heroicons-arrow-right" class="h-3 w-3 text-muted-foreground ml-auto" />
                    </div>
                  </div>
                  <div v-else class="text-sm text-muted-foreground">
                    暂无参与者
                  </div>
                  <div class="text-xs text-muted-foreground">
                    {{ task.participants }}/{{ task.maxParticipants }} 人
                  </div>
                </div>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">难度:</span>
                <span class="text-foreground">{{ task.difficulty }}</span>
              </div>
            </div>
          </div>
          
          <div class="bg-card border border-border rounded-xl p-6">
            <h3 class="text-lg font-bold text-foreground mb-4">操作</h3>
            <div class="space-y-3">
              <UButton
                v-if="task.status === 'unclaimed'"
                @click="claimTask"
                class="w-full"
                color="primary"
                size="lg"
              >
                领取任务
              </UButton>
              
              <UButton
                v-if="task.status === 'in_progress'"
                @click="submitTask"
                class="w-full"
                color="accent"
                size="lg"
              >
                提交任务
              </UButton>
              
              <UButton
                v-if="task.status === 'under_review'"
                @click="reviewTask"
                class="w-full"
                color="warning"
                size="lg"
              >
                审核任务
              </UButton>
              
              <UButton
                v-if="task.status === 'completed'"
                class="w-full"
                color="success"
                size="lg"
                disabled
              >
                已完成
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- 任务进度 -->
      <div class="mt-8 bg-card border border-border rounded-xl p-6">
        <h2 class="text-2xl font-bold text-foreground mb-6">任务进度</h2>
        <div class="space-y-4">
          <div
            v-for="(update, index) in task.updates"
            :key="update.id"
            class="relative"
          >
            <!-- 时间线连接线 -->
            <div 
              v-if="index < task.updates.length - 1"
              class="absolute left-4 top-8 w-0.5 h-8 bg-primary/30"
            ></div>
            
            <!-- 时间线节点 -->
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <div class="w-3 h-3 rounded-full bg-white"></div>
              </div>
              
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-sm font-medium text-foreground">{{ update.title }}</span>
                  <span class="text-xs text-muted-foreground">{{ formatDate(update.timestamp) }}</span>
                  <span 
                    v-if="update.status"
                    class="px-2 py-1 text-xs rounded-full"
                    :class="getStatusClass(update.status)"
                  >
                    {{ getStatusText(update.status) }}
                  </span>
                </div>
                <p class="text-sm text-muted-foreground">{{ update.description }}</p>
                
                <!-- 显示实时状态 -->
                <div v-if="update.isRealTime" class="mt-2 flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <span class="text-xs text-primary">实时更新中...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 获取路由参数
const route = useRoute()
const taskId = route.params.id

// 任务数据
const task = ref({
  id: taskId,
  title: '完成项目提案',
  description: '提交一份完整的项目提案文档，包括技术方案、商业模式、团队介绍等',
  reward: 0.5,
  status: 'unclaimed',
  deadline: '2025-10-25',
  creator: 'Alice',
  participants: 0,
  maxParticipants: 5,
  difficulty: '中等',
  communityId: 1,
  participantsList: [],
  requirements: [
    '技术方案详细说明',
    '商业模式分析',
    '团队介绍和分工',
    '预算和时间规划',
    '风险评估和应对措施'
  ],
  submissionInstructions: '请将完整的项目提案文档以PDF格式提交，文件大小不超过10MB。',
  updates: [
    {
      id: 1,
      title: '任务创建',
      description: '任务已创建，等待参与者领取',
      timestamp: '2025-01-15T10:00:00Z',
      status: 'completed'
    }
  ]
})

// 状态文本
const getStatusText = (status) => {
  const statusMap = {
    'unclaimed': '未领取',
    'in_progress': '进行中',
    'completed': '已完成',
    'under_review': '审核中',
    'rejected': '已驳回'
  }
  return statusMap[status] || '未知'
}

// 状态样式类
const getStatusClass = (status) => {
  const statusClassMap = {
    'completed': 'bg-success/10 text-success',
    'in_progress': 'bg-primary/10 text-primary',
    'under_review': 'bg-warning/10 text-warning',
    'rejected': 'bg-destructive/10 text-destructive'
  }
  return statusClassMap[status] || 'bg-muted/10 text-muted-foreground'
}

// 格式化日期
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 实时更新时间线
const updateTimeline = () => {
  const now = new Date().toISOString()
  
  // 添加实时更新
  if (task.value.status === 'in_progress') {
    const hasRealTimeUpdate = task.value.updates.some(update => update.isRealTime)
    if (!hasRealTimeUpdate) {
      task.value.updates.push({
        id: Date.now(),
        title: '任务进行中',
        description: '任务正在进行中，等待提交...',
        timestamp: now,
        status: 'in_progress',
        isRealTime: true
      })
    }
  }
}

// 领取任务
const claimTask = async () => {
  console.log('领取任务:', taskId)
  task.value.status = 'in_progress'
  task.value.participants = 1
  
  // 添加参与者信息
  task.value.participantsList.push({
    id: 1,
    name: 'Bob',
    role: '区块链开发者',
    avatar: '/images/avatar2.png'
  })
  
  // 添加时间线更新
  const now = new Date().toISOString()
  task.value.updates.push({
    id: Date.now(),
    title: '任务领取',
    description: '任务已被领取，开始执行',
    timestamp: now,
    status: 'in_progress'
  })
  
  // 开始实时更新
  updateTimeline()
  
  // 这里可以添加实际的API调用
}

// 提交任务
const submitTask = () => {
  navigateTo('/tasks/detail/' + taskId + '/submit')
}

// 审核任务
const reviewTask = () => {
  navigateTo('/tasks/detail/' + taskId + '/review')
}

// 导航到成员页面
const navigateToMember = (memberId) => {
  navigateTo('/member/' + memberId)
}

// 组件挂载时开始实时更新
onMounted(() => {
  // 检查是否从提交页面返回
  const route = useRoute()
  if (route.query.submitted === 'true') {
    // 更新任务状态为审核中
    task.value.status = 'under_review'
    
    // 添加提交时间线更新
    const now = new Date().toISOString()
    task.value.updates.push({
      id: Date.now(),
      title: '任务提交',
      description: '任务已完成并提交，等待审核',
      timestamp: now,
      status: 'under_review'
    })
    
    // 移除实时更新标记
    const realTimeIndex = task.value.updates.findIndex(update => update.isRealTime)
    if (realTimeIndex !== -1) {
      task.value.updates.splice(realTimeIndex, 1)
    }
    
    // 清理URL参数
    navigateTo('/tasks/' + taskId, { replace: true })
  }
  
  // 检查是否从审核页面返回
  if (route.query.reviewed === 'true') {
    // 更新任务状态为已完成
    task.value.status = 'completed'
    
    // 添加审核完成时间线更新
    const now = new Date().toISOString()
    task.value.updates.push({
      id: Date.now(),
      title: '审核完成',
      description: '任务审核通过，智能合约已自动发放奖励',
      timestamp: now,
      status: 'completed'
    })
    
    // 清理URL参数
    navigateTo('/tasks/' + taskId, { replace: true })
  }
  
  // 如果任务正在进行中，开始实时更新
  if (task.value.status === 'in_progress') {
    updateTimeline()
  }
  
  // 设置定时器，每30秒更新一次时间线
  const interval = setInterval(() => {
    if (task.value.status === 'in_progress') {
      updateTimeline()
    }
  }, 30000)
  
  // 组件卸载时清理定时器
  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>
