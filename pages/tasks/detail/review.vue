<template>
  <div class="min-h-screen bg-mario-sky py-4 md:py-8">
    <div class="container mx-auto px-4 md:px-6 max-w-4xl">
      <!-- 返回按钮 -->
      <div class="mb-6">
        <PixelButton
          @click="navigateTo(`/tasks/${taskId}`)"
          variant="secondary"
          size="sm"
        >
          ← 返回任务详情
        </PixelButton>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="font-pixel text-lg text-white text-shadow-pixel animate-pulse">加载中...</div>
      </div>

      <!-- 审核表单 -->
      <div v-else>
        <PixelCard>
          <template #header>
            审核任务
          </template>
          
          <p class="font-vt323 text-lg text-black mb-6">请仔细审核任务完成情况，并给出审核结果</p>
          
          <form @submit.prevent="submitReview" class="space-y-6">
            <!-- 任务信息 -->
            <div class="bg-white border-2 border-black shadow-pixel-sm p-4">
              <h3 class="font-pixel text-xs uppercase text-black mb-2">{{ task.title }}</h3>
              <p class="font-vt323 text-base text-black mb-3">{{ task.description }}</p>
              <div class="flex items-center gap-3 flex-wrap">
                <span class="px-3 py-1.5 bg-mario-coin text-white border-2 border-black shadow-pixel-sm font-pixel text-[10px] uppercase">
                  {{ task.reward }} ETH
                </span>
                <span class="font-vt323 text-sm text-black">截止: {{ formatDate(task.deadline) }}</span>
              </div>
            </div>

            <!-- 提交者信息 -->
            <div class="pt-4 border-t-2 border-black/20">
              <h3 class="font-pixel text-xs uppercase text-black mb-4">提交者信息</h3>
              <div class="bg-white border-2 border-black shadow-pixel-sm p-4">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-12 h-12 bg-mario-red border-2 border-black flex items-center justify-center font-pixel text-lg text-white">
                    {{ submission.submitter.name.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <h4 class="font-pixel text-xs uppercase text-black">{{ submission.submitter.name.toUpperCase() }}</h4>
                    <p class="font-vt323 text-sm text-black/70">{{ submission.submitter.role }}</p>
                  </div>
                </div>
                <div class="font-vt323 text-sm text-black space-y-1 pt-3 border-t border-black/10">
                  <p><span class="font-medium">提交时间:</span> {{ formatDate(submission.timestamp) }}</p>
                  <p><span class="font-medium">提交说明:</span> {{ submission.description }}</p>
                </div>
              </div>
            </div>

            <!-- 提交文件 -->
            <div class="pt-4 border-t-2 border-black/20">
              <h3 class="font-pixel text-xs uppercase text-black mb-4">提交文件</h3>
              <div class="space-y-3">
                <!-- 主要文件 -->
                <div v-if="submission.mainFile" class="bg-white border-2 border-black shadow-pixel-sm p-4">
                  <div class="flex items-center gap-3 mb-2">
                    <span class="text-2xl">📄</span>
                    <div class="flex-1">
                      <div class="font-vt323 text-base text-black font-medium">{{ submission.mainFile.name }}</div>
                      <div class="font-vt323 text-xs text-black/60">({{ formatFileSize(submission.mainFile.size) }})</div>
                    </div>
                    <PixelButton
                      @click="downloadFile(submission.mainFile)"
                      variant="primary"
                      size="sm"
                    >
                      下载
                    </PixelButton>
                  </div>
                  <p class="font-vt323 text-xs text-black/70 mt-2">主要证明文件</p>
                </div>

                <!-- 附加文件 -->
                <div v-if="submission.additionalFiles && submission.additionalFiles.length > 0">
                  <h4 class="font-pixel text-[10px] uppercase text-black mb-2">附加文件</h4>
                  <div class="space-y-2">
                    <div
                      v-for="(file, index) in submission.additionalFiles"
                      :key="index"
                      class="bg-white border-2 border-black shadow-pixel-sm p-3"
                    >
                      <div class="flex items-center gap-3">
                        <span class="text-xl">📎</span>
                        <div class="flex-1">
                          <div class="font-vt323 text-sm text-black font-medium">{{ file.name }}</div>
                          <div class="font-vt323 text-xs text-black/60">({{ formatFileSize(file.size) }})</div>
                        </div>
                        <PixelButton
                          @click="downloadFile(file)"
                          variant="secondary"
                          size="sm"
                        >
                          下载
                        </PixelButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 审核结果 -->
            <div class="pt-4 border-t-2 border-black/20">
              <h3 class="font-pixel text-xs uppercase text-black mb-4">审核结果</h3>
              <div class="space-y-4">
                <div>
                  <label class="block font-pixel text-[10px] uppercase text-black mb-2">
                    审核决定 <span class="text-mario-red">*</span>
                  </label>
                  <div class="flex gap-4">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input
                        v-model="reviewResult.decision"
                        type="radio"
                        value="approved"
                        class="w-4 h-4 border-2 border-black accent-mario-green"
                      />
                      <span class="font-vt323 text-base text-black">通过</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input
                        v-model="reviewResult.decision"
                        type="radio"
                        value="rejected"
                        class="w-4 h-4 border-2 border-black accent-mario-red"
                      />
                      <span class="font-vt323 text-base text-black">拒绝</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label class="block font-pixel text-[10px] uppercase text-black mb-2">
                    审核评分 (1-10分)
                  </label>
                  <div class="flex items-center gap-4">
                    <input
                      v-model.number="reviewResult.score"
                      type="range"
                      min="1"
                      max="10"
                      class="flex-1 h-2 bg-white border-2 border-black accent-mario-yellow"
                    />
                    <span class="font-pixel text-sm text-black border-2 border-black bg-white px-3 py-1 shadow-pixel-sm">
                      {{ reviewResult.score }}
                    </span>
                  </div>
                </div>

                <div>
                  <label class="block font-pixel text-xs uppercase text-black mb-2">
                    审核意见 <span class="text-mario-red">*</span>
                  </label>
                  <textarea
                    v-model="reviewResult.comments"
                    placeholder="请详细说明审核意见，包括优点、不足和改进建议..."
                    rows="6"
                    class="w-full px-4 py-3 bg-white border-2 border-black shadow-pixel-sm font-vt323 text-base text-black focus:outline-none focus:shadow-pixel focus:-translate-y-1 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            <!-- 智能合约信息 -->
            <div v-if="reviewResult.decision === 'approved'" class="bg-mario-green/20 border-2 border-mario-green shadow-pixel-sm p-4">
              <h4 class="font-pixel text-xs uppercase text-black mb-2">智能合约激励</h4>
              <p class="font-vt323 text-sm text-black mb-2">
                审核通过后，智能合约将自动发放 {{ task.reward }} ETH 奖励给参与者。
              </p>
              <div class="flex items-center gap-2 font-vt323 text-sm text-black">
                <span class="text-lg">✓</span>
                <span>奖励将通过智能合约自动发放</span>
              </div>
            </div>

            <!-- 提交按钮 -->
            <div class="flex gap-4 pt-6 border-t-2 border-black/20">
              <PixelButton
                @click="navigateTo(`/tasks/${taskId}`)"
                variant="secondary"
                size="lg"
                :block="false"
              >
                取消
              </PixelButton>
              <PixelButton
                type="submit"
                variant="primary"
                size="lg"
                :block="false"
                :disabled="!canSubmit || isSubmitting"
              >
                {{ isSubmitting ? '提交中...' : '提交审核' }}
              </PixelButton>
            </div>
          </form>
        </PixelCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import PixelCard from '~/components/pixel/PixelCard.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'
import type { Task } from '~/utils/api'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { getTaskById, approveTask, rejectTask, apiBaseUrl } = useApi()

// 获取路由参数
const route = useRoute()
const router = useRouter()
const taskId = (route.query.id || route.params.id) as string  // UUID string
const toast = useToast()
const loading = ref(true)

// 响应式数据
const reviewResult = ref<{
  decision: string
  score: number
  comments: string
}>({
  decision: '',
  score: 5,
  comments: ''
})
const isSubmitting = ref(false)

// 任务数据
const task = ref<{
  id: number
  title: string
  description: string
  reward: number
  deadline: string
}>({
  id: taskId,
  title: '',
  description: '',
  reward: 0,
  deadline: ''
})

// 提交数据
const submission = ref<{
  submitter: {
    name: string
    role: string
  }
  timestamp: string
  description: string
  mainFile: {
    name: string
    size: number
    url: string
  } | null
  additionalFiles: Array<{
    name: string
    size: number
    url: string
  }>
}>({
  submitter: {
    name: '',
    role: '参与者'
  },
  timestamp: '',
  description: '',
  mainFile: null,
  additionalFiles: []
})

// 计算属性
const canSubmit = computed(() => {
  return reviewResult.value.decision && reviewResult.value.comments.trim().length > 0
})

// 格式化日期（后端已返回本地时间格式 YYYY-MM-DDTHH:mm）
const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  
  // 后端统一返回本地时间格式 YYYY-MM-DDTHH:mm，直接解析
  const [datePart, timePart] = dateString.split('T')
  if (!datePart || !timePart) {
    // 兼容旧数据：如果是 ISO 格式，转换为本地时间
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}年${month}月${day}日`
  }
  
  // 直接解析本地时间格式 YYYY-MM-DDTHH:mm
  const [year, month, day] = datePart.split('-')
  return `${year}年${month}月${day}日`
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 下载文件
const downloadFile = (file: { name: string; url: string }) => {
  console.log('下载文件:', file.name)
  // 如果文件有 URL，打开下载链接
  if (file.url) {
    window.open(file.url, '_blank')
  } else {
    // 这里可以添加实际的下载逻辑
    toast.add({
      title: '下载文件',
      description: `准备下载 ${file.name}`,
      color: 'blue'
    })
  }
}

// 加载任务数据和提交信息
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
      deadline: taskData.deadline || taskData.createdAt, // 使用截止日期，如果没有则使用创建时间作为后备
    }
    
    // 从任务数据中获取提交信息
    if (taskData.claimerName && taskData.submittedAt) {
      submission.value = {
        submitter: {
          name: taskData.claimerName,
          role: '参与者'
        },
        timestamp: taskData.submittedAt,
        description: taskData.proof || '已完成任务，等待审核。',
        mainFile: taskData.proof ? {
          name: '任务完成凭证.txt',
          size: new Blob([taskData.proof]).size,
          url: `data:text/plain;charset=utf-8,${encodeURIComponent(taskData.proof)}`
        } : null,
        additionalFiles: []
      }
    } else {
      // 如果没有提交信息，显示提示
      toast.add({
        title: '提示',
        description: '该任务尚未提交凭证',
        color: 'yellow'
      })
    }
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

// 提交审核
const submitReview = async () => {
  if (!canSubmit.value) return
  
  isSubmitting.value = true
  
  try {
    let result
    
    if (reviewResult.value.decision === 'approved') {
      // 审核通过
      result = await approveTask(taskId, reviewResult.value.comments || undefined)
    } else {
      // 审核驳回
      result = await rejectTask(taskId, reviewResult.value.comments)
    }
    
    if (result.success) {
      toast.add({
        title: '审核成功',
        description: result.message,
        color: 'green'
      })
      
      // 提交成功后跳转到任务详情页
      router.push(`/tasks/${taskId}?reviewed=true`)
    } else {
      toast.add({
        title: '审核失败',
        description: result.message,
        color: 'red'
      })
    }
    
  } catch (error) {
    console.error('审核提交失败:', error)
    toast.add({
      title: '审核失败',
      description: '网络错误，请稍后重试',
      color: 'red'
    })
  } finally {
    isSubmitting.value = false
  }
}

// 导航函数
const navigateTo = (path: string) => {
  router.push(path)
}

// 组件挂载时加载任务数据
onMounted(() => {
  loadTask()
})
</script>
