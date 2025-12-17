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

      <!-- 提交表单 -->
      <div v-else>
        <PixelCard>
          <template #header>
            提交任务
          </template>
          
          <p class="font-vt323 text-lg text-black mb-6">请上传您的任务完成证明和相关文件</p>
          
          <form @submit.prevent="submitForm" class="space-y-6">
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

            <!-- 提交说明 -->
            <div class="pt-4 border-t-2 border-black/20">
              <h3 class="font-pixel text-xs uppercase text-black mb-2">提交说明</h3>
              <p class="font-vt323 text-base text-black">{{ task.submissionInstructions || '请按照任务要求完成并提交相关凭证。' }}</p>
            </div>

            <!-- 文件上传 -->
            <div class="pt-4 border-t-2 border-black/20">
              <h3 class="font-pixel text-xs uppercase text-black mb-4">上传文件</h3>
              <div class="space-y-4">
                <!-- 主要证明文件 -->
                <div>
                  <label class="block font-pixel text-[10px] uppercase text-black mb-2">
                    主要证明文件 <span class="text-mario-red">*</span>
                  </label>
                  <div 
                    @click="triggerFileInput('main')"
                    class="border-2 border-dashed border-black bg-white p-6 md:p-8 text-center cursor-pointer hover:-translate-y-0.5 hover:shadow-pixel transition-all"
                    :class="{ 'border-mario-red shadow-pixel': dragOver }"
                    @dragover.prevent="dragOver = true"
                    @dragleave="dragOver = false"
                    @drop.prevent="handleFileDrop($event, 'main')"
                  >
                    <div class="text-4xl mb-3">☁️</div>
                    <p class="font-vt323 text-base text-black font-medium mb-1">点击上传或拖拽文件到此处</p>
                    <p class="font-vt323 text-sm text-black/70">支持 PDF, DOC, DOCX, PNG, JPG 格式</p>
                    <p class="font-vt323 text-xs text-black/60 mt-1">最大 10MB</p>
                  </div>
                  <input
                    ref="mainFileInput"
                    type="file"
                    class="hidden"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    @change="handleFileSelect($event, 'main')"
                  />
                  
                  <!-- 已选择的文件 -->
                  <div v-if="selectedFiles.main" class="mt-3 p-3 bg-white border-2 border-black shadow-pixel-sm">
                    <div class="flex items-center gap-3">
                      <span class="text-2xl">📄</span>
                      <div class="flex-1">
                        <div class="font-vt323 text-sm text-black font-medium">{{ selectedFiles.main.name }}</div>
                        <div class="font-vt323 text-xs text-black/60">({{ formatFileSize(selectedFiles.main.size) }})</div>
                      </div>
                      <PixelButton
                        @click="removeFile('main')"
                        variant="danger"
                        size="sm"
                      >
                        移除
                      </PixelButton>
                    </div>
                  </div>
                </div>

                <!-- 附加文件 -->
                <div>
                  <label class="block font-pixel text-[10px] uppercase text-black mb-2">
                    附加文件 (可选)
                  </label>
                  <div 
                    @click="triggerFileInput('additional')"
                    class="border-2 border-dashed border-black bg-white p-4 md:p-6 text-center cursor-pointer hover:-translate-y-0.5 hover:shadow-pixel transition-all"
                  >
                    <div class="text-2xl mb-2">➕</div>
                    <p class="font-vt323 text-sm text-black">添加更多文件</p>
                  </div>
                  <input
                    ref="additionalFileInput"
                    type="file"
                    multiple
                    class="hidden"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    @change="handleFileSelect($event, 'additional')"
                  />
                  
                  <!-- 已选择的附加文件 -->
                  <div v-if="selectedFiles.additional.length > 0" class="mt-3 space-y-2">
                    <div
                      v-for="(file, index) in selectedFiles.additional"
                      :key="index"
                      class="p-3 bg-white border-2 border-black shadow-pixel-sm"
                    >
                      <div class="flex items-center gap-3">
                        <span class="text-2xl">📄</span>
                        <div class="flex-1">
                          <div class="font-vt323 text-sm text-black font-medium">{{ file.name }}</div>
                          <div class="font-vt323 text-xs text-black/60">({{ formatFileSize(file.size) }})</div>
                        </div>
                        <PixelButton
                          @click="removeFile('additional', index)"
                          variant="danger"
                          size="sm"
                        >
                          移除
                        </PixelButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 提交说明输入 -->
            <div class="pt-4 border-t-2 border-black/20">
              <label class="block font-pixel text-xs uppercase text-black mb-2">
                提交说明 <span class="text-mario-red">*</span>
              </label>
              <textarea
                v-model="submissionDescription"
                placeholder="请详细描述您完成的任务内容，包括主要工作、技术实现、遇到的问题和解决方案等..."
                rows="6"
                class="w-full px-4 py-3 bg-white border-2 border-black shadow-pixel-sm font-vt323 text-base text-black focus:outline-none focus:shadow-pixel focus:-translate-y-1 transition-all resize-none"
              />
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
                {{ isSubmitting ? '提交中...' : '提交任务' }}
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
import type { Task, ProofData, ProofFile } from '~/utils/api'
import {useUserStore} from '~/stores/user'
import {useGeolocation, type GPSPosition} from '~/composables/useGeolocation'

const userStore = useUserStore()

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { getTaskById, submitProof, uploadProofFile, getMe, apiBaseUrl } = useApi()
const { getCurrentLocation, validateGPSAccuracy } = useGeolocation()

// 获取路由参数
const route = useRoute()
const router = useRouter()
const taskId = (route.query.id || route.params.id) as string  // UUID string
const toast = useToast()
const loading = ref(true)

// 响应式数据
const selectedFiles = ref<{
  main: File | null
  additional: File[]
}>({
  main: null,
  additional: []
})
const submissionDescription = ref('')
const isSubmitting = ref(false)
const dragOver = ref(false)

// 文件输入引用
const mainFileInput = ref<HTMLInputElement | null>(null)
const additionalFileInput = ref<HTMLInputElement | null>(null)

// 任务数据
const task = ref<Task>({
  id: taskId,
  title: '',
  description: '',
  reward: 0,
  deadline: '',
  status: 'unclaimed',
  isClaimed: false,
  proofConfig: undefined
} as Task)

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
    
    // 直接使用 API 返回的任务数据
    task.value = taskData
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

// 计算属性
const canSubmit = computed(() => {
  return selectedFiles.value.main && submissionDescription.value.trim().length > 0
})

// 触发文件输入
const triggerFileInput = (type: 'main' | 'additional') => {
  if (type === 'main') {
    mainFileInput.value?.click()
  } else {
    additionalFileInput.value?.click()
  }
}

// 处理文件选择
const handleFileSelect = (event: Event, type: 'main' | 'additional') => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  if (type === 'main') {
    selectedFiles.value.main = files[0] || null
  } else {
    selectedFiles.value.additional = [...selectedFiles.value.additional, ...files]
  }
}

// 处理文件拖拽
const handleFileDrop = (event: DragEvent, type: 'main' | 'additional') => {
  dragOver.value = false
  const files = Array.from(event.dataTransfer?.files || [])
  if (type === 'main') {
    selectedFiles.value.main = files[0] || null
  } else {
    selectedFiles.value.additional = [...selectedFiles.value.additional, ...files]
  }
}

// 移除文件
const removeFile = (type: 'main' | 'additional', index?: number) => {
  if (type === 'main') {
    selectedFiles.value.main = null
  } else if (index !== undefined) {
    selectedFiles.value.additional.splice(index, 1)
  }
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 格式化日期
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 提交表单
const submitForm = async () => 
{
  if (!canSubmit.value) return
  
  isSubmitting.value = true
  
  try
  {
    // 获取当前用户 ID 
    const user = userStore.user || await getMe()
    if(!user || !user.id)
    {
      throw new Error('请先登录')
    }

    // 获取GPS位置
    let gpsData: GPSPosition | undefined
    if(task.value.proofConfig?.gps?.enabled)
    {
      try
      {
        gpsData = await getCurrentLocation()

        // 验证GPS精度
        const requiredAccuracy = task.value.proofConfig.gps.accuracy || 'medium'
        if(!validateGPSAccuracy(gpsData.accuracy, requiredAccuracy))
        {
          toast.add({
            title: 'GPS精度不足',
            description: `当前GPS精度为${gpsData.accuracy.toFixed(2)}米，任务要求：${requiredAccuracy}`,
            color:'red'
          })
          return
        }
      } catch (error:any)
      {
        toast.add({
          title: '获取GPS位置失败',
          description: error.message || '无法获取GPS位置，请检查定位权限',
          color: 'red'
        })
        return
      }
    }

    // 上传文件到后端
    const filesToUpload: File[] = []
    if(selectedFiles.value.main)
    {
      filesToUpload.push(selectedFiles.value.main)
    }
    filesToUpload.push(...selectedFiles.value.additional)

    let uploadedFiles: ProofFile[] = []
    if(filesToUpload.length > 0)
    {
      try
      {
        uploadedFiles = await uploadProofFile(filesToUpload, taskId, apiBaseUrl)
      } catch(error:any)
      {
        toast.add
        ({
          title: '文件上传失败',
          description: error.message || '文件上传失败，请稍后重试',
          color: 'red'
        })
        return
      }
    }

    // 构建完整的 proof 数据
    const proofData: ProofData =
    {
      description: submissionDescription.value,
      files: uploadedFiles,
      gps: gpsData ? {
        latitude: gpsData.latitude,
        longitude: gpsData.longitude,
        accuracy: gpsData.accuracy,
        timestamp: gpsData.timestamp
      } : undefined,
      submittedAt: new Date().toISOString()
    }

    // 调用 API 提交凭证
    const result = await submitProof(taskId, proofData, apiBaseUrl)

    if(result.success)
    {
      toast.add({
        title:'提交成功',
        description: result.message || '任务提交成功，等待审核',
        color:'green'
      })
      router.push(`/tasks/${taskId}?submitted=true`)
    }else
    {
      toast.add({
        title: '提交失败',
        description: result.message || '任务提交失败，请稍后重试',
        color: 'red'
      })
    }
    
  } catch(error:any)
    {
      console.error('提交失败：',error)
      toast.add
      ({
        title:'提交失败',
        description: error.message || '网络错误，请稍后重试',
        color: 'red'
      })
    } finally
    {
      isSubmitting.value = false
    }

}

// 导航函数
const navigateTo = (path: string) => {
  router.push(path)
}

// 组件挂载时加载任务
onMounted(() => {
  loadTask()
})
</script>
