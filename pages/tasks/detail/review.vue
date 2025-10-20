<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto px-6 py-8">
      <!-- 返回按钮 -->
      <div class="mb-8">
        <button
          @click="navigateTo('/tasks/' + taskId)"
          class="mb-4 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group cursor-pointer"
        >
          <UIcon name="i-heroicons-arrow-left" class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span class="font-medium">返回任务详情</span>
        </button>
      </div>

      <!-- 审核表单 -->
      <div class="max-w-4xl mx-auto">
        <div class="bg-card border border-border rounded-xl p-6">
          <h1 class="text-3xl font-bold text-foreground mb-2">审核任务</h1>
          <p class="text-muted-foreground mb-8">请仔细审核任务完成情况，并给出审核结果</p>
          
          <form @submit.prevent="submitReview" class="space-y-6">
            <!-- 任务信息 -->
            <div class="bg-muted/50 rounded-lg p-4">
              <h3 class="text-lg font-semibold text-foreground mb-2">{{ task.title }}</h3>
              <p class="text-muted-foreground">{{ task.description }}</p>
              <div class="flex items-center gap-4 mt-2">
                <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {{ task.reward }} ETH
                </span>
                <span class="text-sm text-muted-foreground">截止: {{ formatDate(task.deadline) }}</span>
              </div>
            </div>

            <!-- 提交者信息 -->
            <div>
              <h3 class="text-lg font-semibold text-foreground mb-4">提交者信息</h3>
              <div class="bg-muted/50 rounded-lg p-4">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    {{ submission.submitter.name.charAt(0) }}
                  </div>
                  <div>
                    <h4 class="font-semibold text-foreground">{{ submission.submitter.name }}</h4>
                    <p class="text-sm text-muted-foreground">{{ submission.submitter.role }}</p>
                  </div>
                </div>
                <div class="text-sm text-muted-foreground">
                  <p>提交时间: {{ formatDate(submission.timestamp) }}</p>
                  <p>提交说明: {{ submission.description }}</p>
                </div>
              </div>
            </div>

            <!-- 提交文件 -->
            <div>
              <h3 class="text-lg font-semibold text-foreground mb-4">提交文件</h3>
              <div class="space-y-3">
                <!-- 主要文件 -->
                <div v-if="submission.mainFile" class="border border-border rounded-lg p-4">
                  <div class="flex items-center gap-3 mb-2">
                    <UIcon name="i-heroicons-document" class="h-5 w-5 text-primary" />
                    <span class="font-medium text-foreground">{{ submission.mainFile.name }}</span>
                    <span class="text-sm text-muted-foreground">({{ formatFileSize(submission.mainFile.size) }})</span>
                    <UButton
                      @click="downloadFile(submission.mainFile)"
                      size="sm"
                      color="primary"
                      variant="ghost"
                      class="ml-auto"
                    >
                      下载
                    </UButton>
                  </div>
                  <p class="text-sm text-muted-foreground">主要证明文件</p>
                </div>

                <!-- 附加文件 -->
                <div v-if="submission.additionalFiles && submission.additionalFiles.length > 0">
                  <h4 class="text-sm font-medium text-foreground mb-2">附加文件</h4>
                  <div class="space-y-2">
                    <div
                      v-for="(file, index) in submission.additionalFiles"
                      :key="index"
                      class="border border-border rounded-lg p-3"
                    >
                      <div class="flex items-center gap-3">
                        <UIcon name="i-heroicons-document" class="h-4 w-4 text-muted-foreground" />
                        <span class="text-sm text-foreground">{{ file.name }}</span>
                        <span class="text-xs text-muted-foreground">({{ formatFileSize(file.size) }})</span>
                        <UButton
                          @click="downloadFile(file)"
                          size="sm"
                          color="gray"
                          variant="ghost"
                          class="ml-auto"
                        >
                          下载
                        </UButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 审核结果 -->
            <div>
              <h3 class="text-lg font-semibold text-foreground mb-4">审核结果</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    审核决定 <span class="text-destructive">*</span>
                  </label>
                  <div class="flex gap-4">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input
                        v-model="reviewResult.decision"
                        type="radio"
                        value="approved"
                        class="text-primary"
                      />
                      <span class="text-foreground">通过</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input
                        v-model="reviewResult.decision"
                        type="radio"
                        value="rejected"
                        class="text-destructive"
                      />
                      <span class="text-foreground">拒绝</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    审核评分 (1-10分)
                  </label>
                  <div class="flex items-center gap-4">
                    <input
                      v-model="reviewResult.score"
                      type="range"
                      min="1"
                      max="10"
                      class="flex-1"
                    />
                    <span class="text-lg font-bold text-primary">{{ reviewResult.score }}</span>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    审核意见 <span class="text-destructive">*</span>
                  </label>
                  <UTextarea
                    v-model="reviewResult.comments"
                    placeholder="请详细说明审核意见，包括优点、不足和改进建议..."
                    rows="6"
                    class="w-full"
                  />
                </div>
              </div>
            </div>

            <!-- 智能合约信息 -->
            <div v-if="reviewResult.decision === 'approved'" class="bg-success/10 border border-success/20 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-success mb-2">智能合约激励</h4>
              <p class="text-sm text-muted-foreground mb-2">
                审核通过后，智能合约将自动发放 {{ task.reward }} ETH 奖励给参与者。
              </p>
              <div class="flex items-center gap-2 text-sm text-success">
                <UIcon name="i-heroicons-check-circle" class="h-4 w-4" />
                <span>奖励将通过智能合约自动发放</span>
              </div>
            </div>

            <!-- 提交按钮 -->
            <div class="flex gap-4 pt-6 border-t border-border">
              <UButton
                @click="navigateTo('/tasks/' + taskId)"
                color="gray"
                variant="ghost"
                size="lg"
              >
                取消
              </UButton>
              <UButton
                type="submit"
                color="primary"
                size="lg"
                :disabled="!canSubmit"
                :loading="isSubmitting"
              >
                {{ isSubmitting ? '提交中...' : '提交审核' }}
              </UButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 获取路由参数
const route = useRoute()
const taskId = route.params.id

// 响应式数据
const reviewResult = ref({
  decision: '',
  score: 5,
  comments: ''
})
const isSubmitting = ref(false)

// 任务数据
const task = ref({
  id: taskId,
  title: '完成项目提案',
  description: '提交一份完整的项目提案文档，包括技术方案、商业模式、团队介绍等',
  reward: 0.5,
  deadline: '2025-10-25'
})

// 提交数据
const submission = ref({
  submitter: {
    name: 'Bob',
    role: '区块链开发者'
  },
  timestamp: '2025-01-15T10:30:00Z',
  description: '已完成项目提案文档，包括技术方案、商业模式分析、团队介绍、预算规划等。文档结构清晰，内容详实，符合项目要求。',
  mainFile: {
    name: '项目提案文档.pdf',
    size: 2048576,
    url: '/files/proposal.pdf'
  },
  additionalFiles: [
    {
      name: '技术方案详细说明.pdf',
      size: 1024000,
      url: '/files/technical-spec.pdf'
    },
    {
      name: '商业模式分析.xlsx',
      size: 512000,
      url: '/files/business-model.xlsx'
    }
  ]
})

// 计算属性
const canSubmit = computed(() => {
  return reviewResult.value.decision && reviewResult.value.comments.trim().length > 0
})

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

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 下载文件
const downloadFile = (file) => {
  console.log('下载文件:', file.name)
  // 这里可以添加实际的下载逻辑
}

// 提交审核
const submitReview = async () => {
  if (!canSubmit.value) return
  
  isSubmitting.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('提交审核:', {
      taskId,
      decision: reviewResult.value.decision,
      score: reviewResult.value.score,
      comments: reviewResult.value.comments
    })
    
    // 如果审核通过，触发智能合约发放奖励
    if (reviewResult.value.decision === 'approved') {
      await triggerSmartContractReward()
    }
    
    // 提交成功后跳转到任务详情页
    await navigateTo('/tasks/' + taskId + '?reviewed=true')
    
  } catch (error) {
    console.error('审核提交失败:', error)
  } finally {
    isSubmitting.value = false
  }
}

// 触发智能合约发放奖励
const triggerSmartContractReward = async () => {
  console.log('触发智能合约发放奖励:', task.value.reward, 'ETH')
  // 这里可以添加实际的智能合约调用
  // 例如：调用智能合约的发放奖励函数
}
</script>
