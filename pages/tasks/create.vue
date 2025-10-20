<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto px-6 py-8">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground mb-2">创建任务</h1>
        <p class="text-muted-foreground"></p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 主要内容区域 -->
        <div class="lg:col-span-2">
          <!-- 任务创建表单 -->
          <UCard class="card">
            <template #header>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <h2 class="text-xl font-bold text-foreground">任务创建</h2>
              </div>
            </template>

            <div class="space-y-6">
              <!-- 基本信息 -->
              <div class="space-y-4">
                <UFormGroup label="任务标题" required>
                  <UInput 
                    v-model="taskForm.title" 
                    placeholder="输入任务标题..."
                    size="lg"
                  />
                </UFormGroup>

                <UFormGroup label="任务目标" required>
                  <UTextarea 
                    v-model="taskForm.objective" 
                    placeholder="描述任务的具体目标..."
                    :rows="3"
                  />
                </UFormGroup>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <UFormGroup label="奖励金额 (ETH)" required>
                    <UInput 
                      v-model="taskForm.reward" 
                      type="number"
                      step="0.01"
                      placeholder="0.1"
                    />
                  </UFormGroup>

                  <UFormGroup label="截止日期" required>
                    <UInput 
                      v-model="taskForm.deadline" 
                      type="datetime-local"
                    />
                  </UFormGroup>
                </div>
              </div>

              <!-- 证明要求配置 -->
              <div class="border-t border-border pt-6">
                <h3 class="text-lg font-semibold text-foreground mb-4">证明要求配置</h3>
                <div class="space-y-4">
                  <!-- 照片证据 -->
                  <div class="p-4 border border-border rounded-lg">
                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center gap-3">
                        <UIcon name="i-heroicons-camera" class="h-5 w-5 text-foreground" />
                        <h4 class="font-semibold text-foreground">照片证据</h4>
                      </div>
                      <UToggle v-model="proofConfig.photo.enabled" />
                    </div>
                    
                    <div v-if="proofConfig.photo.enabled" class="space-y-3">
                      <UFormGroup label="照片数量">
                        <USelect 
                          v-model="proofConfig.photo.count"
                          :options="photoCountOptions"
                        />
                      </UFormGroup>
                      <UFormGroup label="要求说明">
                        <UTextarea 
                          v-model="proofConfig.photo.requirements"
                          placeholder="描述照片的具体要求..."
                          :rows="2"
                        />
                      </UFormGroup>
                    </div>
                  </div>

                  <!-- GPS定位 -->
                  <div class="p-4 border border-border rounded-lg">
                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center gap-3">
                        <UIcon name="i-heroicons-map-pin" class="h-5 w-5 text-foreground" />
                        <h4 class="font-semibold text-foreground">GPS 定位</h4>
                      </div>
                      <UToggle v-model="proofConfig.gps.enabled" />
                    </div>
                    
                    <div v-if="proofConfig.gps.enabled" class="space-y-3">
                      <UFormGroup label="定位精度">
                        <USelect 
                          v-model="proofConfig.gps.accuracy"
                          :options="gpsAccuracyOptions"
                        />
                      </UFormGroup>
                    </div>
                  </div>

                  <!-- 文字描述 -->
                  <div class="p-4 border border-border rounded-lg">
                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center gap-3">
                        <UIcon name="i-heroicons-document-text" class="h-5 w-5 text-foreground" />
                        <h4 class="font-semibold text-foreground">文字描述</h4>
                      </div>
                      <UToggle v-model="proofConfig.description.enabled" />
                    </div>
                    
                    <div v-if="proofConfig.description.enabled" class="space-y-3">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <UFormGroup label="最少字数">
                          <UInput 
                            v-model="proofConfig.description.minWords"
                            type="number"
                            placeholder="50"
                          />
                        </UFormGroup>
                        <UFormGroup label="提示语">
                          <UInput 
                            v-model="proofConfig.description.prompt"
                            placeholder="请描述..."
                          />
                        </UFormGroup>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="flex gap-4 pt-6 border-t border-border">
                <UButton 
                  @click="generateOKR"
                  :loading="isGeneratingOKR"
                  color="primary"
                  size="lg"
                  class="flex items-center gap-2"
                >
                  <UIcon name="i-heroicons-sparkles" class="h-5 w-5" />
                  启动 AI 分析
                </UButton>
                
                <UButton 
                  @click="publishTask"
                  :loading="isPublishing"
                  :disabled="!canPublish"
                  color="green"
                  size="lg"
                  class="flex items-center gap-2"
                >
                  <UIcon name="i-heroicons-wallet" class="h-5 w-5" />
                  发布任务（钱包签名）
                </UButton>
              </div>
            </div>
          </UCard>
        </div>

        <!-- 侧边栏 -->
        <div class="space-y-6">
          <!-- 任务摘要 -->
          <UCard class="card">
            <template #header>
              <h3 class="text-lg font-bold text-foreground">任务摘要</h3>
            </template>

            <div class="space-y-4">
              <div v-if="taskForm.title" class="p-3 bg-muted/50 rounded-lg">
                <div class="text-sm text-muted-foreground mb-1">任务标题</div>
                <div class="text-foreground font-medium">{{ taskForm.title }}</div>
              </div>

              <div v-if="taskForm.reward" class="p-3 bg-muted/50 rounded-lg">
                <div class="text-sm text-muted-foreground mb-1">奖励金额</div>
                <div class="text-foreground font-medium">{{ taskForm.reward }} ETH</div>
              </div>

              <div v-if="taskForm.deadline" class="p-3 bg-muted/50 rounded-lg">
                <div class="text-sm text-muted-foreground mb-1">截止日期</div>
                <div class="text-foreground font-medium">{{ formatDate(taskForm.deadline) }}</div>
              </div>

              <!-- 完成进度 -->
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-muted-foreground">完成进度</span>
                  <span class="text-foreground">{{ completionProgress }}%</span>
                </div>
                <UProgress :value="completionProgress" color="primary" />
              </div>
            </div>
          </UCard>

          <!-- AI 分析结果 -->
          <UCard v-if="okrData" class="card">
            <template #header>
              <div class="flex items-center gap-3">
                <h3 class="text-lg font-bold text-foreground">AI 分析结果</h3>
                <UBadge color="green" variant="soft">AI 分析完成</UBadge>
              </div>
            </template>

            <div class="space-y-4">
              <!-- 目标 -->
              <div>
                <h4 class="text-sm font-semibold text-foreground mb-2">目标 (Objective)</h4>
                <div class="p-3 bg-muted/50 rounded-lg border border-border">
                  <p class="text-sm text-foreground">{{ okrData.objective }}</p>
                </div>
              </div>

              <!-- 关键结果 -->
              <div>
                <h4 class="text-sm font-semibold text-foreground mb-2">关键结果 (Key Results)</h4>
                <div class="space-y-2">
                  <div 
                    v-for="(kr, index) in okrData.keyResults" 
                    :key="index"
                    class="p-3 bg-card border border-border rounded-lg"
                  >
                    <div class="flex items-start gap-2">
                      <div class="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                        {{ index + 1 }}
                      </div>
                      <div class="flex-1">
                        <h5 class="text-sm font-medium text-foreground mb-1">{{ kr.kr }}</h5>
                        <div class="text-xs text-muted-foreground">
                          <div>衡量指标: {{ kr.metric }}</div>
                          <div>目标值: {{ kr.target }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 任务表单数据
const taskForm = ref({
  title: '',
  objective: '',
  reward: '',
  deadline: ''
})

// OKR数据
const okrData = ref<{
  objective: string
  keyResults: Array<{
    kr: string
    metric: string
    target: string
  }>
} | null>(null)

// 证明配置
const proofConfig = ref({
  photo: {
    enabled: false,
    count: '1',
    requirements: ''
  },
  gps: {
    enabled: false,
    accuracy: 'high'
  },
  description: {
    enabled: false,
    minWords: 50,
    prompt: ''
  }
})

// 加载状态
const isGeneratingOKR = ref(false)
const isPublishing = ref(false)

// 选项数据
const photoCountOptions = [
  { label: '1张', value: '1' },
  { label: '2张', value: '2' },
  { label: '3张', value: '3' },
  { label: '4张', value: '4' },
  { label: '5张', value: '5' }
]

const gpsAccuracyOptions = [
  { label: '高精度 (±5米)', value: 'high' },
  { label: '中精度 (±50米)', value: 'medium' },
  { label: '低精度 (±500米)', value: 'low' }
]

// 计算属性
const completionProgress = computed(() => {
  let progress = 0
  if (taskForm.value.title) progress += 20
  if (taskForm.value.objective) progress += 20
  if (taskForm.value.reward) progress += 20
  if (taskForm.value.deadline) progress += 20
  if (okrData.value) progress += 20
  return progress
})

const canPublish = computed(() => {
  return taskForm.value.title && 
         taskForm.value.objective && 
         taskForm.value.reward && 
         taskForm.value.deadline && 
         okrData.value
})

// 方法
const generateOKR = async () => {
  isGeneratingOKR.value = true
  
  // 模拟AI分析延迟
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // 模拟AI生成的OKR
  okrData.value = {
    objective: `通过${taskForm.value.title}，实现${taskForm.value.objective}的目标`,
    keyResults: [
      {
        kr: '完成核心功能开发',
        metric: '功能完成度',
        target: '100%'
      },
      {
        kr: '通过质量测试',
        metric: '测试通过率',
        target: '95%以上'
      },
      {
        kr: '按时交付',
        metric: '交付时间',
        target: '在截止日期前完成'
      }
    ]
  }
  
  isGeneratingOKR.value = false
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

const publishTask = async () => {
  isPublishing.value = true
  
  // 模拟钱包签名和发布
  await new Promise(resolve => setTimeout(resolve, 3000))
  
  // 显示成功消息
  const toast = useToast()
  toast.add({
    title: '任务发布成功！',
    description: '任务已成功发布到区块链网络',
    color: 'green'
  })
  
  isPublishing.value = false
  
  // 跳转到任务列表
  await navigateTo('/tasks')
}
</script>
