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
                <div class="flex flex-col gap-1">
                  <span class="font-vt323 text-sm text-black">领取截止: {{ formatDate(task.deadline) }}</span>
                  <span class="font-vt323 text-sm text-black">提交截止: {{ formatDate(task.submitDeadline || task.deadline) }}</span>
                </div>
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
                </div>
              </div>
            </div>

            <!-- 提交内容（按顺序：图片 → 位置信息 → 文字说明） -->
            <div class="pt-4 border-t-2 border-black/20">
              <h3 class="font-pixel text-xs uppercase text-black mb-4">提交内容</h3>
              
              <!-- 1. 图片文件（优先显示）- 响应式设计：手机端2列，平板3列，电脑端4列 -->
              <div v-if="submission.files && submission.files.length > 0" class="mb-4">
                <h4 class="font-pixel text-[10px] uppercase text-black mb-3">提交图片</h4>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    <div
                    v-for="(file, index) in submission.files"
                      :key="index"
                    class="bg-white border-2 border-black shadow-pixel-sm p-3 relative group"
                    >
                    <!-- 图片预览 -->
                    <div class="aspect-square bg-gray-100 border border-black mb-2 overflow-hidden">
                      <img 
                        :src="file.url" 
                        :alt="file.name"
                        class="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform"
                        @click="previewFile(file)"
                      />
                        </div>
                    <!-- 文件信息 - 名称显示已关闭 -->
                    <!-- <div class="font-vt323 text-xs text-black mb-2">
                      <div class="font-medium truncate">{{ file.name }}</div>
                      <div class="text-black/60">({{ formatFileSize(file.size) }})</div>
                        </div> -->
                    <!-- 操作按钮 -->
                        <div class="flex gap-2">
                          <PixelButton
                            @click="previewFile(file)"
                            variant="secondary"
                            size="sm"
                        :block="true"
                          >
                            预览
                          </PixelButton>
                          <PixelButton
                            @click="downloadFile(file)"
                        variant="primary"
                            size="sm"
                        :block="true"
                          >
                            下载
                          </PixelButton>
                  </div>
                </div>
              </div>
            </div>

              <!-- 2. 位置信息（经纬度） -->
              <div v-if="submission.gpsLocation" class="mb-4">
                <h4 class="font-pixel text-[10px] uppercase text-black mb-3">位置信息</h4>
                <div class="bg-white border-2 border-black shadow-pixel-sm p-4">
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-2xl">📍</span>
                    <span class="font-pixel text-xs uppercase text-black">GPS定位</span>
                </div>
                <div class="font-vt323 text-sm text-black space-y-1">
                    <div><span class="font-medium">纬度:</span> {{ submission.gpsLocation.latitude.toFixed(6) }}</div>
                    <div><span class="font-medium">经度:</span> {{ submission.gpsLocation.longitude.toFixed(6) }}</div>
                    <div v-if="submission.gpsLocation.accuracy" class="text-black/60">
                      <span class="font-medium">精度:</span> ±{{ Math.round(submission.gpsLocation.accuracy) }}米
                    </div>
                  <div v-if="submission.gpsLocation.timestamp" class="text-black/60 mt-2">
                      <span class="font-medium">获取时间:</span> {{ formatDate(submission.gpsLocation.timestamp ? (typeof submission.gpsLocation.timestamp === 'number' ? new Date(submission.gpsLocation.timestamp).toISOString() : String(submission.gpsLocation.timestamp)) : undefined) }}
                  </div>
                </div>
              </div>
              </div>

              <!-- 3. 文字说明 -->
              <div v-if="submission.description && submission.description.trim()">
                <h4 class="font-pixel text-[10px] uppercase text-black mb-3">文字说明</h4>
                <div class="bg-white border-2 border-black shadow-pixel-sm p-4">
                  <p class="font-vt323 text-base text-black whitespace-pre-wrap">{{ submission.description }}</p>
                </div>
              </div>

              <!-- 空状态 -->
              <div v-if="!submission.files?.length && !submission.gpsLocation && !submission.description" class="bg-gray-50 border-2 border-dashed border-black/30 p-4 text-center">
                <p class="font-vt323 text-sm text-black/60">未提交任何内容</p>
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

    <!-- 拒绝选项弹窗 -->
    <div
      v-if="showRejectModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click="showRejectModal = false"
    >
      <div
        class="bg-white border-2 border-black shadow-pixel-lg max-w-lg w-full"
        @click.stop
      >
        <div class="p-6">
          <h3 class="font-pixel text-sm uppercase text-black mb-4">选择拒绝选项</h3>
          
          <div class="space-y-4 mb-6">
            <!-- 重新提交证明 -->
            <label class="block p-4 bg-gray-50 border-2 border-black shadow-pixel-sm cursor-pointer hover:bg-gray-100 transition-colors" :class="{ 'bg-mario-green/20 border-mario-green': rejectOption === 'resubmit' }">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="text-xl">🔄</span>
                  <span class="font-vt323 text-base text-black">重新提交证明</span>
                </div>
                <div class="relative inline-flex items-center">
                  <input 
                    type="radio" 
                    v-model="rejectOption"
                    value="resubmit"
                    class="w-4 h-4 border-2 border-black accent-mario-green"
                  />
                </div>
              </div>
            </label>

            <!-- 重新发布任务 -->
            <label class="block p-4 bg-gray-50 border-2 border-black shadow-pixel-sm cursor-pointer hover:bg-gray-100 transition-colors" :class="{ 'bg-mario-green/20 border-mario-green': rejectOption === 'reclaim' }">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="text-xl">📋</span>
                  <span class="font-vt323 text-base text-black">重新发布任务</span>
                </div>
                <div class="relative inline-flex items-center">
                  <input 
                    type="radio" 
                    v-model="rejectOption"
                    value="reclaim"
                    class="w-4 h-4 border-2 border-black accent-mario-green"
                  />
                </div>
              </div>
            </label>

            <!-- 结束任务 -->
            <label class="block p-4 bg-gray-50 border-2 border-black shadow-pixel-sm cursor-pointer hover:bg-gray-100 transition-colors" :class="{ 'bg-mario-red/20 border-mario-red': rejectOption === 'end' }">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="text-xl">❌</span>
                  <span class="font-vt323 text-base text-black">结束任务</span>
                </div>
                <div class="relative inline-flex items-center">
                  <input 
                    type="radio" 
                    v-model="rejectOption"
                    value="end"
                    class="w-4 h-4 border-2 border-black accent-mario-red"
                  />
                </div>
              </div>
            </label>
          </div>

          <div class="mb-6">
            <label class="block font-pixel text-xs uppercase text-black mb-2">
              审核意见 <span class="text-mario-red">*</span>
            </label>
            <textarea
              v-model="reviewResult.comments"
              placeholder="请详细说明审核意见..."
              rows="4"
              class="w-full px-4 py-3 bg-white border-2 border-black shadow-pixel-sm font-vt323 text-base text-black focus:outline-none focus:shadow-pixel focus:-translate-y-1 transition-all resize-none"
            />
          </div>

          <div class="flex gap-4">
            <PixelButton
              @click="showRejectModal = false"
              variant="secondary"
              size="lg"
              :block="false"
            >
              取消
            </PixelButton>
            <PixelButton
              @click="confirmReject"
              variant="danger"
              size="lg"
              :block="false"
              :disabled="!rejectOption || !reviewResult.comments.trim() || isSubmitting"
            >
              {{ isSubmitting ? '提交中...' : '确认拒绝' }}
            </PixelButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getTaskById, approveTask, rejectTask, getApiBaseUrl } from '~/utils/api'
import { useToast } from '~/composables/useToast'
import { useUserStore } from '~/stores/user'
import PixelCard from '~/components/pixel/PixelCard.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'
import { getTaskRewardSymbol } from '~/utils/display'
import type { Task } from '~/utils/api'

// 获取路由参数
const route = useRoute()
const router = useRouter()
const taskId = (route.query.id || route.params.id) as string  // UUID是字符串，不需要parseInt
const toast = useToast()
const loading = ref(true)
const userStore = useUserStore()

// 响应式数据
const reviewResult = ref<{
  decision: string
  comments: string
}>({
  decision: '',
  comments: ''
})
const isSubmitting = ref(false)
const taskRewardSymbol = ref('积分') // 任务奖励的积分符号

// 拒绝选项弹窗相关状态
const showRejectModal = ref(false)
const rejectOption = ref<'resubmit' | 'reclaim' | 'end' | ''>('')

// 任务数据
const task = ref<{
  id: string
  title: string
  description: string
  reward: number
  deadline: string
  submitDeadline?: string
  creatorId: string
  proofConfig?: any
  participantLimit?: number | null
  participantsList?: Array<{
    id: string
    name: string
    claimedAt?: string
    submittedAt?: string
    proof?: string
    status?: string
  }>
}>({
  id: taskId,
  title: '',
  description: '',
  reward: 0,
  deadline: '',
  submitDeadline: '',
  creatorId: '',
  proofConfig: null,
  participantLimit: null,
  participantsList: []
})

// 权限检查：判断当前用户是否是任务创建者
const canReview = computed(() => {
  return userStore.user?.id === task.value.creatorId
})

// 所有参与者的提交数据（多人任务）
const allSubmissions = ref<Array<{
  taskId: string
  submitter: {
    id: string
    name: string
    role: string
  }
  timestamp: string
  description: string
  files: Array<{
    name: string
    size: number
    url: string
    type?: string
  }>
  gpsLocation?: {
    latitude: number
    longitude: number
    accuracy?: number
    timestamp?: number
  } | null
  status: string
  reward?: number
}>>([])

// 当前选中的提交（用于审核）
const currentSubmissionIndex = ref(0)
const currentSubmission = computed(() => allSubmissions.value[currentSubmissionIndex.value] || null)

// 向后兼容：单个提交数据（用于单人任务）
const submission = computed(() => {
  if (allSubmissions.value.length === 0) {
    return {
  submitter: {
    name: '',
    role: '参与者'
  },
  timestamp: '',
  description: '',
      files: [],
  gpsLocation: null
    }
  }
  const sub = allSubmissions.value[currentSubmissionIndex.value]
  return {
    submitter: sub.submitter,
    timestamp: sub.timestamp,
    description: sub.description,
    files: sub.files,
    gpsLocation: sub.gpsLocation
  }
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
// 方案A：统一使用 ISO 8601 格式，前端使用 toLocaleString 显示本地时间
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '未设置'
  
  // 统一解析为 Date 对象（支持 ISO 8601 格式和 YYYY-MM-DDTHH:mm 格式）
  let date: Date
  
  // 如果是 YYYY-MM-DDTHH:mm 格式（向后兼容），解析为本地时间
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dateString)) {
    const [datePart, timePart] = dateString.split('T')
    const [year, month, day] = datePart.split('-').map(Number)
    const [hour, minute] = timePart.split(':').map(Number)
    date = new Date(year, month - 1, day, hour, minute)
  } else {
    // ISO 8601 格式（带时区信息），浏览器会自动处理时区转换
    date = new Date(dateString)
  }
  
  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return '未设置'
  }
  
  // 使用 toLocaleString 显示本地时间（浏览器自动处理时区）
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
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
const downloadFile = async (file: { name: string; url: string }) => {
  if (!file.url) {
    toast.add({
      title: '无法下载',
      description: '文件URL不存在',
      color: 'red'
    })
    return
  }
  
  try {
    // 对于 data URL，直接下载
    if (file.url.startsWith('data:')) {
      const link = document.createElement('a')
      link.href = file.url
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      return
    }
    
    // 对于 HTTP/HTTPS URL，先获取文件内容再下载
    const response = await fetch(file.url)
    if (!response.ok) {
      throw new Error('下载失败')
    }
    
    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(blobUrl)
    
    toast.add({
      title: '下载成功',
      description: `已下载 ${file.name}`,
      color: 'green'
    })
  } catch (error) {
    console.error('下载文件失败:', error)
    toast.add({
      title: '下载失败',
      description: '无法下载文件，请稍后重试',
      color: 'red'
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
    
    // 转换API数据为页面需要的格式
    task.value = {
      id: taskData.id,
      title: taskData.title,
      description: taskData.description,
      reward: taskData.reward,
      deadline: taskData.deadline || taskData.createdAt || '', // 领取截止日期
      submitDeadline: taskData.submitDeadline || taskData.deadline || taskData.createdAt || '', // 提交截止日期
      creatorId: taskData.creatorId || '',
      proofConfig: taskData.proofConfig || null,
      participantLimit: taskData.participantLimit || null,
      participantsList: taskData.participantsList || []
    }
    
    // 获取任务奖励的积分符号
    taskRewardSymbol.value = await getTaskRewardSymbol(taskData)
    
    // 处理多人任务：获取所有参与者的提交（包括未领取和未提交的）
    if (taskData.participantsList && Array.isArray(taskData.participantsList) && taskData.participantsList.length > 0) {
      // 获取所有参与者，包括未领取的
      const allParticipants = taskData.participantsList
      
      // 为每个参与者创建提交数据
      allSubmissions.value = allParticipants.map((p: any) => {
          // 解析提交内容
          let proofContent = p.proof || ''
          let files: Array<{ name: string; size: number; url: string; type?: string }> = []
          let gpsLocation: { latitude: number; longitude: number; accuracy?: number; timestamp?: number } | null = null
          let description = ''
          
          try {
            if (proofContent.trim().startsWith('{')) {
              const parsed = JSON.parse(proofContent)
              
              if (parsed.files && Array.isArray(parsed.files)) {
                files = parsed.files.map((file: any) => ({
                  name: file.name || '未命名文件',
                  size: file.size || 0,
                  url: file.url || '',
                  type: file.type || ''
                }))
              }
              
              if (parsed.gps) {
                gpsLocation = {
                  latitude: parsed.gps.latitude || parsed.gps.lat || 0,
                  longitude: parsed.gps.longitude || parsed.gps.lng || 0,
                  accuracy: parsed.gps.accuracy,
                  timestamp: parsed.gps.timestamp
                }
              } else if (parsed.latitude && parsed.longitude) {
                gpsLocation = {
                  latitude: parsed.latitude,
                  longitude: parsed.longitude,
                  accuracy: parsed.accuracy,
                  timestamp: parsed.timestamp
                }
              }
              
              description = parsed.description || ''
            } else if (proofContent.startsWith('位置:')) {
              const match = proofContent.match(/位置:\s*([\d.]+),\s*([\d.]+)/)
              if (match) {
                gpsLocation = {
                  latitude: parseFloat(match[1]),
                  longitude: parseFloat(match[2])
                }
              } else {
                description = proofContent
              }
            } else {
              description = proofContent
            }
          } catch (e) {
            description = proofContent
          }
          
          return {
            taskId: p.id || taskData.id,
            submitter: {
              id: p.id || '',
              name: p.name || '未领取',
              role: '参与者'
            },
            timestamp: p.submittedAt || p.claimedAt || '',
            description: description,
            files: files,
            gpsLocation: gpsLocation,
            status: p.status || (p.claimedAt ? (p.submittedAt ? 'submitted' : 'claimed') : 'unclaimed'),
            reward: taskData.reward // 使用任务的基础奖励，实际奖励可能根据权重系数计算
          }
        })
      
      // 排序：未审核的（submitted, under_review）、未领取的（unclaimed, claimed, unsubmit）、已审核的（completed, rejected）
      allSubmissions.value.sort((a, b) => {
        const getStatusPriority = (status: string) => {
          // 未审核的：优先级 1
          if (status === 'submitted' || status === 'under_review') return 1
          // 未领取的：优先级 2
          if (status === 'unclaimed' || status === 'claimed' || status === 'unsubmit') return 2
          // 已审核的：优先级 3
          if (status === 'completed' || status === 'rejected') return 3
          return 4
        }
        
        const priorityA = getStatusPriority(a.status)
        const priorityB = getStatusPriority(b.status)
        
        if (priorityA !== priorityB) {
          return priorityA - priorityB
        }
        
        // 相同优先级内，按时间排序（最新的在前）
        return new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()
      })
      
      // 如果有多个提交，默认显示第一个未审核的
      const firstUnreviewedIndex = allSubmissions.value.findIndex(
        s => s.status === 'submitted' || s.status === 'under_review'
      )
      if (firstUnreviewedIndex !== -1) {
        currentSubmissionIndex.value = firstUnreviewedIndex
      } else if (allSubmissions.value.length > 0) {
        currentSubmissionIndex.value = 0
      }
    } else if (taskData.claimerName && taskData.submittedAt) {
      // 单人任务：向后兼容
      // 解析提交内容（JSON格式：{description, files, gps, submittedAt}）
      let proofContent = taskData.proof || ''
      let files: Array<{ name: string; size: number; url: string; type?: string }> = []
      let gpsLocation: { latitude: number; longitude: number; accuracy?: number; timestamp?: number } | null = null
      let description = ''
      
      // 尝试解析JSON格式的提交内容
      try {
        if (proofContent.trim().startsWith('{')) {
          const parsed = JSON.parse(proofContent)
          
          // 解析文件列表
          if (parsed.files && Array.isArray(parsed.files)) {
            files = parsed.files.map((file: any) => ({
              name: file.name || '未命名文件',
              size: file.size || 0,
              url: file.url || '',
              type: file.type || ''
            }))
          }
          
          // 解析GPS位置信息
          if (parsed.gps) {
            gpsLocation = {
              latitude: parsed.gps.latitude || parsed.gps.lat || 0,
              longitude: parsed.gps.longitude || parsed.gps.lng || 0,
              accuracy: parsed.gps.accuracy,
              timestamp: parsed.gps.timestamp
            }
          } else if (parsed.latitude && parsed.longitude) {
            // 向后兼容：直接在根级别有经纬度
            gpsLocation = {
              latitude: parsed.latitude,
              longitude: parsed.longitude,
              accuracy: parsed.accuracy,
              timestamp: parsed.timestamp
            }
          }
          
          // 解析文字描述
          description = parsed.description || ''
        } else if (proofContent.startsWith('位置:')) {
          // 处理 "位置: lat, lng" 格式（向后兼容）
          const match = proofContent.match(/位置:\s*([\d.]+),\s*([\d.]+)/)
          if (match) {
            gpsLocation = {
              latitude: parseFloat(match[1]),
              longitude: parseFloat(match[2])
            }
            description = ''
          } else {
            description = proofContent
          }
        } else {
          // 纯文本格式，作为描述
          description = proofContent
        }
      } catch (e) {
        // 如果不是JSON格式，保持原样作为文字描述
        description = proofContent
      }
      
      // 单人任务：添加到提交列表
      allSubmissions.value = [{
        taskId: taskData.id,
        submitter: {
          id: taskData.claimerId || '',
          name: taskData.claimerName,
          role: '参与者'
        },
        timestamp: taskData.submittedAt,
        description: description,
        files: files,
        gpsLocation: gpsLocation,
        status: taskData.status || 'submitted',
        reward: taskData.reward
      }]
      currentSubmissionIndex.value = 0
    }
    
      // 如果没有提交信息，显示提示
    if (allSubmissions.value.length === 0) {
      toast.add({
        title: '提示',
        description: '该任务尚未有参与者提交凭证',
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
  
  // 如果选择拒绝，显示拒绝选项弹窗
  if (reviewResult.value.decision === 'rejected') {
    showRejectModal.value = true
    return
  }
  
  // 审核通过，直接提交
  isSubmitting.value = true
  
  try {
    const baseUrl = getApiBaseUrl()
    // 使用当前选中提交的任务ID
    const targetTaskId = currentSubmission.value?.taskId || taskId
    const result = await approveTask(targetTaskId, baseUrl, reviewResult.value.comments)
    
    if (result.success) {
      // 更新当前提交的状态
      if (currentSubmission.value) {
        currentSubmission.value.status = reviewResult.value.decision === 'approved' ? 'completed' : 'rejected'
      }
      
      toast.add({
        title: '审核成功',
        description: result.message,
        color: 'green'
      })
      
      // 审核通过后直接跳转到任务详情页（多人任务中每个任务都是独立的）
      // 使用当前审核的任务ID（对于多人任务，这是当前参与者的任务ID）
      const redirectTaskId = currentSubmission.value?.taskId || taskId
      await router.push(`/tasks/${redirectTaskId}?reviewed=true`)
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

// 确认拒绝
const confirmReject = async () => {
  if (!rejectOption.value || !reviewResult.value.comments.trim()) return
  
  // 保存拒绝选项，因为后面会重置
  const selectedOption = rejectOption.value
  isSubmitting.value = true
  
  try {
    const baseUrl = getApiBaseUrl()
    
    // 处理不同的拒绝选项
    let finalOption: 'resubmit' | 'reclaim' | 'rejected' | undefined
    if (selectedOption === 'end') {
      // 结束任务：使用 'rejected' 选项，任务状态变为 rejected，任务关闭并放入已失效
      finalOption = 'rejected'
    } else {
      finalOption = selectedOption as 'resubmit' | 'reclaim'
    }
    
    console.log('[FRONTEND] 审核驳回 - 选项:', selectedOption, '最终选项:', finalOption)
    console.log('[FRONTEND] 审核驳回 - 理由:', reviewResult.value.comments)
    
    const result = await rejectTask(taskId, reviewResult.value.comments, baseUrl, finalOption)
    
    console.log('[FRONTEND] 审核驳回 - 结果:', result)
    
    if (result.success) {
      console.log('[FRONTEND] 审核驳回成功，准备关闭弹窗并跳转')
      
      toast.add({
        title: '审核成功',
        description: result.message,
        color: 'green'
      })
      
      // 关闭弹窗（必须在跳转前关闭）
      showRejectModal.value = false
      rejectOption.value = ''
      reviewResult.value.comments = '' // 清空审核意见
      
      console.log('[FRONTEND] 弹窗已关闭，准备跳转')
      
      // 如果选择结束任务，确保任务状态更新为 rejected
      // 提交成功后跳转到任务详情页，并刷新数据
      if (selectedOption === 'end') {
        console.log('[FRONTEND] 选择了结束任务，延迟500ms后跳转')
        // 延迟一下，确保后端状态已更新
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      
      const redirectPath = `/tasks/${taskId}?reviewed=true&rejected=${selectedOption === 'end' ? 'true' : 'false'}`
      console.log('[FRONTEND] 跳转到:', redirectPath)
      await router.push(redirectPath)
    } else {
      console.error('[FRONTEND] 审核驳回失败:', result.message)
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

