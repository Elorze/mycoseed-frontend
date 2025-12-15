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
          
          <p v-if="canReview" class="font-vt323 text-lg text-black mb-6">请仔细审核任务完成情况，并给出审核结果</p>
          
          <!-- 只读模式提示 -->
          <div v-if="!canReview" class="bg-mario-yellow/20 border-2 border-mario-yellow shadow-pixel-sm p-4 mb-6">
            <p class="font-vt323 text-base text-black">
              <span class="font-pixel text-xs">⚠️</span> 您不是任务创建者，无法进行审核操作
            </p>
          </div>
          
          <form @submit.prevent="submitReview" class="space-y-6">
            <!-- 任务信息 -->
            <div class="bg-white border-2 border-black shadow-pixel-sm p-4">
              <h3 class="font-pixel text-xs uppercase text-black mb-2">{{ task.title }}</h3>
              <p class="font-vt323 text-base text-black mb-3">{{ task.description }}</p>
              <div class="flex items-center gap-3 flex-wrap">
                <span class="px-3 py-1.5 bg-mario-coin text-white border-2 border-black shadow-pixel-sm font-pixel text-[10px] uppercase">
                  {{ task.reward }} {{ taskRewardSymbol }}
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
                  <p v-if="requiresDescription || submission.description"><span class="font-medium">提交说明:</span> {{ submission.description || '无' }}</p>
                </div>
              </div>
            </div>

            <!-- 提交文件 -->
            <div v-if="requiresFileUpload" class="pt-4 border-t-2 border-black/20">
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
                    <div class="flex gap-2">
                      <PixelButton
                        @click="previewFile(submission.mainFile)"
                        variant="secondary"
                        size="sm"
                      >
                        预览
                      </PixelButton>
                      <PixelButton
                        @click="downloadFile(submission.mainFile)"
                        variant="primary"
                        size="sm"
                      >
                        下载
                      </PixelButton>
                    </div>
                  </div>
                  <p class="font-vt323 text-xs text-black/70 mt-2">主要证明文件</p>
                </div>
                <div v-else class="bg-gray-50 border-2 border-dashed border-black/30 p-4 text-center">
                  <p class="font-vt323 text-sm text-black/60">未提交文件</p>
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
                        <div class="flex gap-2">
                          <PixelButton
                            @click="previewFile(file)"
                            variant="secondary"
                            size="sm"
                          >
                            预览
                          </PixelButton>
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
            </div>

            <!-- GPS定位信息 -->
            <div v-if="requiresGPS" class="pt-4 border-t-2 border-black/20">
              <h3 class="font-pixel text-xs uppercase text-black mb-4">位置定位信息</h3>
              <div v-if="submission.gpsLocation" class="bg-white border-2 border-black shadow-pixel-sm p-4">
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-2xl">📍</span>
                  <span class="font-pixel text-xs uppercase text-black">位置已验证</span>
                </div>
                <div class="font-vt323 text-sm text-black space-y-1">
                  <div>纬度: {{ submission.gpsLocation.latitude.toFixed(6) }}</div>
                  <div>经度: {{ submission.gpsLocation.longitude.toFixed(6) }}</div>
                  <div v-if="submission.gpsLocation.accuracy">精度: ±{{ Math.round(submission.gpsLocation.accuracy) }}米</div>
                  <div v-if="submission.gpsLocation.timestamp" class="text-black/60 mt-2">
                    获取时间: {{ formatDate(new Date(submission.gpsLocation.timestamp).toISOString()) }}
                  </div>
                </div>
              </div>
              <div v-else class="bg-gray-50 border-2 border-dashed border-black/30 p-4 text-center">
                <p class="font-vt323 text-sm text-black/60">未提供位置信息</p>
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
                        :disabled="!canReview"
                      />
                      <span class="font-vt323 text-base text-black">通过</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input
                        v-model="reviewResult.decision"
                        type="radio"
                        value="rejected"
                        class="w-4 h-4 border-2 border-black accent-mario-red"
                        :disabled="!canReview"
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
                      :disabled="!canReview"
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
                    :disabled="!canReview"
                    :readonly="!canReview"
                  />
                </div>
              </div>
            </div>

            <!-- 提交按钮 -->
            <div v-if="canReview" class="flex gap-4 pt-6 border-t-2 border-black/20">
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
            
            <!-- 只读模式返回按钮 -->
            <div v-else class="flex gap-4 pt-6 border-t-2 border-black/20">
              <PixelButton
                @click="navigateTo(`/tasks/${taskId}`)"
                variant="secondary"
                size="lg"
                :block="true"
              >
                返回任务详情
              </PixelButton>
            </div>
          </form>
        </PixelCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getTaskById, approveTask, rejectTask } from '~/utils/api'
import { useToast } from '~/composables/useToast'
import { useUserStore } from '~/stores/user'
import PixelCard from '~/components/pixel/PixelCard.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'
import { getTaskRewardSymbol } from '~/utils/display'
import type { Task } from '~/utils/api'

// 获取路由参数
const route = useRoute()
const router = useRouter()
const taskId = parseInt((route.query.id || route.params.id) as string)
const toast = useToast()
const loading = ref(true)
const userStore = useUserStore()

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
const taskRewardSymbol = ref('积分') // 任务奖励的积分符号

// 任务数据
const task = ref<{
  id: number
  title: string
  description: string
  reward: number
  deadline: string
  creatorId: number
  proofConfig?: any
}>({
  id: taskId,
  title: '',
  description: '',
  reward: 0,
  deadline: '',
  creatorId: 0,
  proofConfig: null
})

// 权限检查：判断当前用户是否是任务创建者
const canReview = computed(() => {
  return userStore.user?.id === task.value.creatorId
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
  gpsLocation?: {
    latitude: number
    longitude: number
    accuracy: number
    timestamp: number
  } | null
}>({
  submitter: {
    name: '',
    role: '参与者'
  },
  timestamp: '',
  description: '',
  mainFile: null,
  additionalFiles: [],
  gpsLocation: null
})

// 判断是否需要显示文件上传部分
const requiresFileUpload = computed(() => {
  const config = task.value.proofConfig
  if (!config) return false
  return config.photo?.enabled === true
})

// 判断是否需要显示GPS定位信息
const requiresGPS = computed(() => {
  const config = task.value.proofConfig
  if (!config) return false
  return config.gps?.enabled === true
})

// 判断是否需要显示文字描述
const requiresDescription = computed(() => {
  const config = task.value.proofConfig
  if (!config) return false
  return config.description?.enabled === true
})

// 计算属性
const canSubmit = computed(() => {
  return reviewResult.value.decision && reviewResult.value.comments.trim().length > 0
})

// 格式化日期
const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
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
    // 对于 data URL，直接打开
    if (file.url.startsWith('data:')) {
      window.open(file.url, '_blank')
    } else {
      // 对于其他 URL，创建下载链接
      const link = document.createElement('a')
      link.href = file.url
      link.download = file.name
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  } else {
    // 这里可以添加实际的下载逻辑
    toast.add({
      title: '下载文件',
      description: `准备下载 ${file.name}`,
      color: 'blue'
    })
  }
}

// 预览文件
const previewFile = (file: { name: string; url: string }) => {
  if (!file.url) {
    toast.add({
      title: '无法预览',
      description: '文件URL不存在',
      color: 'red'
    })
    return
  }
  
  const extension = file.name.split('.').pop()?.toLowerCase() || ''
  
  if (['txt', 'text'].includes(extension)) {
    // 文本文件预览：在新窗口打开
    window.open(file.url, '_blank')
  } else if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(extension)) {
    // 图片预览：在新窗口打开
    window.open(file.url, '_blank')
  } else if (extension === 'pdf') {
    // PDF预览：在新窗口打开
    window.open(file.url, '_blank')
  } else if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension)) {
    // Office文档：提示下载或使用在线预览服务
    toast.add({
      title: '预览提示',
      description: 'Office文档需要下载后查看，或使用在线预览服务',
      color: 'blue'
    })
    downloadFile(file)
  } else {
    // 其他文件类型：提示下载
    toast.add({
      title: '预览提示',
      description: '该文件类型不支持预览，请下载后查看',
      color: 'blue'
    })
    downloadFile(file)
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
      deadline: taskData.deadline || taskData.createdAt,
      creatorId: taskData.creatorId,
      proofConfig: taskData.proofConfig || null
    }
    
    // 获取任务奖励的积分符号
    taskRewardSymbol.value = await getTaskRewardSymbol(taskData)
    
    // 从任务数据中获取提交信息
    if (taskData.claimerName && taskData.submittedAt) {
      // 解析提交内容（可能包含GPS位置信息）
      let proofContent = taskData.proof || ''
      let gpsLocation = null
      
      // 尝试解析GPS位置信息（如果proof是JSON格式）
      try {
        if (proofContent.trim().startsWith('{')) {
          const parsed = JSON.parse(proofContent)
          if (parsed.latitude && parsed.longitude) {
            // 提取GPS位置信息
            gpsLocation = {
              latitude: parsed.latitude,
              longitude: parsed.longitude,
              accuracy: parsed.accuracy || null,
              timestamp: parsed.timestamp || null
            }
            // 如果有description字段，使用它作为文字描述
            proofContent = parsed.description || ''
          }
        } else if (proofContent.startsWith('位置:')) {
          // 处理 "位置: lat, lng" 格式（向后兼容）
          const match = proofContent.match(/位置:\s*([\d.]+),\s*([\d.]+)/)
          if (match) {
            gpsLocation = {
              latitude: parseFloat(match[1]),
              longitude: parseFloat(match[2]),
              accuracy: null,
              timestamp: null
            }
            proofContent = ''
          }
        }
      } catch (e) {
        // 如果不是JSON格式，保持原样作为文字描述
      }
      
      // 判断是否需要文件（根据proofConfig）
      const needsFile = taskData.proofConfig?.photo?.enabled
      const mainFile = needsFile && proofContent && !gpsLocation ? {
        name: '任务完成凭证.txt',
        size: new Blob([proofContent]).size,
        url: `data:text/plain;charset=utf-8,${encodeURIComponent(proofContent)}`
      } : null
      
      submission.value = {
        submitter: {
          name: taskData.claimerName,
          role: '参与者'
        },
        timestamp: taskData.submittedAt,
        description: proofContent || (taskData.proofConfig?.description?.enabled ? '无' : ''),
        mainFile: mainFile,
        additionalFiles: [],
        gpsLocation: gpsLocation
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
      result = await approveTask(taskId)
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
onMounted(async () => {
  // 确保用户信息已加载
  await userStore.getUser()
  await loadTask()
})
</script>
