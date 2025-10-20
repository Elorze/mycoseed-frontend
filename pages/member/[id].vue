<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto px-6 py-8">
      <!-- 返回按钮 -->
      <div class="mb-8">
        <button
          @click="navigateTo('/')"
          class="mb-4 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group cursor-pointer"
        >
          <UIcon name="i-heroicons-arrow-left" class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span class="font-medium"></span>
        </button>
      </div>

      <!-- 成员信息卡片 -->
      <div class="mb-8">
        <div class="bg-card border border-border rounded-xl p-6">
          <div class="flex items-center gap-6 mb-6">
            <div class="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-white">
              {{ member.name.charAt(0) }}
            </div>
            <div>
              <h1 class="text-3xl font-bold text-foreground">{{ member.name }}</h1>
              <p class="text-muted-foreground">{{ member.title }}</p>
              <div class="flex items-center gap-2 mt-2">
                <div class="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <span class="text-sm text-muted-foreground">在线</span>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-primary">{{ member.totalContributions }}</div>
              <div class="text-sm text-muted-foreground">总贡献</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-accent">{{ member.completedTasks }}</div>
              <div class="text-sm text-muted-foreground">完成任务</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-warning">{{ member.totalReward }} ETH</div>
              <div class="text-sm text-muted-foreground">总奖励</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-success">{{ member.reputation }}</div>
              <div class="text-sm text-muted-foreground">声誉值</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 参与的社区 -->
      <div class="bg-card border border-border rounded-xl p-6 mb-8">
        <h2 class="text-2xl font-bold text-foreground mb-6">参与的社区</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="community in member.communities"
            :key="community.id"
            @click="navigateToDashboard(community.id)"
            class="group cursor-pointer border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
          >
            <div class="flex items-center gap-3 mb-2">
              <div class="w-8 h-8 rounded-full" :style="{ backgroundColor: community.color }"></div>
              <h3 class="font-semibold text-foreground group-hover:text-primary transition-colors">
                {{ community.name }}
              </h3>
            </div>
            <p class="text-sm text-muted-foreground mb-2">{{ community.description }}</p>
            <div class="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{{ community.contributionCount }} 贡献</span>
              <span>{{ community.reward }} ETH</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 最近活动 -->
      <div class="bg-card border border-border rounded-xl p-6">
        <h2 class="text-2xl font-bold text-foreground mb-6">最近活动</h2>
        
        <div v-if="recentActivities.length === 0" class="text-center py-12 text-muted-foreground">
          暂无活动记录
        </div>
        
        <div v-else class="space-y-4">
          <div
            v-for="activity in recentActivities"
            :key="activity.id"
            @click="viewActivityDetail(activity.id)"
            class="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: activity.color }"></div>
                  <h3 class="text-lg font-semibold text-foreground">{{ activity.title }}</h3>
                  <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {{ activity.reward }} ETH
                  </span>
                </div>
                <p class="text-muted-foreground mb-2">{{ activity.description }}</p>
                <div class="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>社区: {{ activity.community }}</span>
                  <span>时间: {{ formatDate(activity.timestamp) }}</span>
                  <span>状态: {{ getStatusText(activity.status) }}</span>
                </div>
              </div>
              <UButton
                @click.stop="viewActivityDetail(activity.id)"
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
</template>

<script setup>
// 获取路由参数
const route = useRoute()
const memberId = route.params.id

// 成员数据
const member = ref({
  id: memberId,
  name: 'Alice',
  title: '区块链开发者',
  totalContributions: 15,
  completedTasks: 12,
  totalReward: 2.5,
  reputation: 850,
  communities: [
    {
      id: 1,
      name: 'ETH 上海社区',
      description: '专注于以太坊生态发展的技术社区',
      color: '#10b981',
      contributionCount: 8,
      reward: 1.2
    },
    {
      id: 2,
      name: 'Web3 开发者联盟',
      description: '汇聚全球优秀Web3开发者的技术社区',
      color: '#14b8a6',
      contributionCount: 7,
      reward: 1.3
    }
  ]
})

// 最近活动数据
const recentActivities = ref([
  {
    id: 1,
    title: '完成智能合约开发',
    description: '为DeFi项目开发了新的流动性挖矿合约',
    reward: 0.5,
    community: 'ETH 上海社区',
    color: '#10b981',
    status: 'completed',
    timestamp: '2025-01-15T10:30:00Z'
  },
  {
    id: 2,
    title: '参与代码审查',
    description: '审查了3个开源项目的代码质量',
    reward: 0.2,
    community: 'Web3 开发者联盟',
    color: '#14b8a6',
    status: 'completed',
    timestamp: '2025-01-14T15:45:00Z'
  },
  {
    id: 3,
    title: '撰写技术文档',
    description: '为Layer2扩容技术编写了详细的技术文档',
    reward: 0.3,
    community: 'ETH 上海社区',
    color: '#10b981',
    status: 'in_progress',
    timestamp: '2025-01-13T09:20:00Z'
  }
])

// 状态文本
const getStatusText = (status) => {
  const statusMap = {
    'completed': '已完成',
    'in_progress': '进行中',
    'pending': '待处理',
    'under_review': '审核中'
  }
  return statusMap[status] || '未知'
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

// 导航到社区面板
const navigateToDashboard = (communityId) => {
  navigateTo('/dashboard?community=' + communityId)
}

// 查看活动详情
const viewActivityDetail = (activityId) => {
  navigateTo('/activities/' + activityId)
}
</script>
