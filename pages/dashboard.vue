<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto px-6 py-8">
      <!-- 页面标题 -->
      <div class="mb-8">
        <button
          @click="navigateTo('/')"
          class="mb-4 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group cursor-pointer"
        >
          <UIcon name="i-heroicons-arrow-left" class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span class="font-medium"></span>
        </button>
        
        <h1 class="text-4xl font-bold text-foreground mb-2">{{ communityInfo.name }}</h1>
        <p class="text-xl text-muted-foreground">{{ communityInfo.description }}</p>
      </div>

      <!-- 社区信息卡片 -->
      <div class="mb-8">
        <div class="bg-card border border-border rounded-xl p-6">
          <h2 class="text-2xl font-bold text-foreground mb-4">社区概览</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center">
              <div class="text-3xl font-bold text-primary">{{ communityStats.totalTasks }}</div>
              <div class="text-sm text-muted-foreground">总任务数</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-accent">{{ communityStats.completedTasks }}</div>
              <div class="text-sm text-muted-foreground">已完成</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-warning">{{ communityStats.pendingTasks }}</div>
              <div class="text-sm text-muted-foreground">待处理</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-success">{{ communityStats.totalReward }} ETH</div>
              <div class="text-sm text-muted-foreground">总奖励</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 最近任务 -->
      <div class="bg-card border border-border rounded-xl p-6">
        <h2 class="text-2xl font-bold text-foreground mb-6">最近任务</h2>
        
        <div v-if="recentTasks.length === 0" class="text-center py-12 text-muted-foreground">
          暂无任务
        </div>
        
        <div v-else class="space-y-4">
          <div
            v-for="task in recentTasks"
            :key="task.id"
            @click="viewTaskDetail(task.id)"
            class="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-lg font-semibold text-foreground">{{ task.title }}</h3>
                  <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {{ task.reward }} ETH
                  </span>
                </div>
                <p class="text-muted-foreground">{{ task.description }}</p>
                <div class="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>状态: {{ getStatusText(task.status) }}</span>
                  <span>截止: {{ formatDate(task.deadline) }}</span>
                </div>
              </div>
              <div class="flex gap-2">
                <UButton
                  v-if="task.status === 'unclaimed'"
                  @click.stop="claimTask(task.id)"
                  size="sm"
                  color="primary"
                >
                  领取
                </UButton>
                <UButton
                  v-if="task.status === 'in_progress'"
                  @click.stop="submitProof(task.id)"
                  size="sm"
                  color="accent"
                >
                  提交凭证
                </UButton>
                <UButton
                  @click.stop="viewTaskDetail(task.id)"
                  size="sm"
                  color="gray"
                  variant="ghost"
                >
                  查看详情
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 创建任务悬浮按钮 -->
    <div class="fixed bottom-8 right-8">
      <UButton
        @click="navigateTo('/tasks/create')"
        class="w-14 h-14 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300"
        color="primary"
        size="lg"
        title="创建新任务"
      >
        <UIcon name="i-heroicons-plus" class="h-6 w-6" />
      </UButton>
    </div>
  </div>
</template>

<script setup>
// 获取路由参数
const route = useRoute()
const communityId = route.query.community

// 社区信息
const communityInfo = ref({
  name: 'ETH 上海社区',
  description: '专注于以太坊生态发展的技术社区'
})

// 根据社区ID设置信息
onMounted(() => {
  const communityMap = {
    '1': { name: 'ETH 上海社区', description: '专注于以太坊生态发展的技术社区' },
    '2': { name: 'Web3 开发者联盟', description: '汇聚全球优秀Web3开发者的技术社区' },
    '3': { name: 'NFT 艺术社区', description: '探索数字艺术与区块链结合的艺术社区' },
    '4': { name: 'DeFi 创新实验室', description: '研究去中心化金融前沿技术的实验室' },
    '5': { name: 'DAO 治理研究', description: '探索去中心化自治组织治理模式的研究社区' },
    '6': { name: 'Layer2 技术社区', description: '专注于Layer2扩容技术的研究与应用' }
  }
  
  if (communityId && communityMap[communityId]) {
    communityInfo.value = communityMap[communityId]
  }
})

// 社区统计数据
const communityStats = ref({
  totalTasks: 12,
  completedTasks: 8,
  pendingTasks: 4,
  totalReward: 2.5
})

// 最近任务数据
const recentTasks = ref([
  {
    id: 1,
    title: '完成项目提案',
    description: '提交一份完整的项目提案文档',
    reward: 0.5,
    status: 'unclaimed',
    deadline: '2025-10-25'
  },
  {
    id: 2,
    title: '组建团队',
    description: '招募3-5名团队成员',
    reward: 0.3,
    status: 'in_progress',
    deadline: '2025-10-30'
  },
  {
    id: 3,
    title: '开发 MVP',
    description: '完成最小可行产品开发',
    reward: 1.0,
    status: 'completed',
    deadline: '2025-11-15'
  }
])

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

// 格式化日期
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 领取任务
const claimTask = async (taskId) => {
  console.log('领取任务:', taskId)
  // 这里可以添加实际的API调用
}

// 提交凭证
const submitProof = async (taskId) => {
  console.log('提交凭证:', taskId)
  // 这里可以添加实际的API调用
}

// 查看任务详情
const viewTaskDetail = (taskId) => {
  navigateTo('/tasks/' + taskId)
}
</script>
