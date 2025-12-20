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
              <h3 class="font-pixel text-xs uppercase text-black mb-4">上传凭证</h3>
              <div class="space-y-4">
                <!-- 照片上传区域 -->
                <div v-if="requiresPhoto">
                  <label class="block font-pixel text-[10px] uppercase text-black mb-2">
                    照片证明 <span class="text-mario-red">*</span>
                  </label>
                  <div
                    @click="triggerFileInput('photo')"
                    class="border-2 border-dashed border-black bg-white p-6 md:p-8 text-center cursor-pointer hover:-translate-y-0.5 hover:shadow-pixel transition-all"
                    :class="{ 'border-mario-red shadow-pixel': dragOver }"
                    @dragover.prevent="dragOver = true"
                    @dragleave="dragOver = false"
                    @drop.prevent="handleFileDrop($event, 'photo')"
                  >
                    <div class="text-4xl mb-3">📷</div>
                    <p class="font-vt323 text-base text-black font-medium mb-1">点击上传或拖拽照片到此处</p>
                    <p class="font-vt323 text-sm text-black/70">支持 JPG, PNG, JPEG 格式</p>
                    <p class="font-vt323 text-xs text-black/60 mt-1">最大 10MB</p>
                  </div>
                  <input
                    ref="photoFileInput"
                    type="file"
                    multiple
                    class="hidden"
                    accept="image/*"
                    @change="handleFileSelect($event, 'photo')"
                  />
                  
                  <!-- 已选择的照片 -->
                  <div v-if="selectedPhotos.length > 0" class="mt-3 space-y-2">
                    <div
                      v-for="(file, index) in selectedPhotos"
                      :key="index"
                      class="p-3 bg-white border-2 border-black shadow-pixel-sm"
                    >
                      <div class="flex items-center gap-3">
                      <span class="text-2xl">📷</span>
                      <div class="flex-1">
                        <div class="font-vt323 text-sm text-black font-medium">{{ file.name }}</div>
                        <div class="font-vt323 text-xs text-black/60">({{ formatFileSize(file.size) }})</div>
                      </div>
                      <PixelButton
                        @click="removeFile('photo', index)"
                        variant="danger"
                        size="sm"
                      >
                        移除
                      </PixelButton>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 文档上传区域 -->
                <div v-if="allowsDocuments">
                  <label class="block font-pixel text-[10px] uppercase text-black mb-2">
                    文档证明 <span v-if="!requiresPhoto" class="text-mario-red">*</span>
                  </label>
                  <div
                    @click="triggerFileInput('document')"
                    class="border-2 border-dashed border-black bg-white p-4 md:p-6 text-center cursor-pointer hover:-translate-y-0.5 hover:shadow-pixel transition-all"
                    :class="{ 'border-mario-red shadow-pixel': dragOver }"
                    @dragover.prevent="dragOver = true"
                    @dragleave="dragOver = false"
                    @drop.prevent="handleFileDrop($event, 'document')"
                  >
                    <div class="text-4xl mb-3">📄</div>
                    <p class="font-vt323 text-base text-black font-medium mb-1">点击上传或拖拽文件到此处</p>
                    <p class="font-vt323 text-sm text-black/70">支持 PDF, DOC, DOCX 格式</p>
                    <p class="font-vt323 text-xs text-black/60 mt-1">最大 10MB</p>
                  </div>
                  <input
                    ref="documentFileInput"
                    type="file"
                    multiple
                    class="hidden"
                    accept=".pdf,.doc,.docx"
                    @change="handleFileSelect($event, 'document')"
                  />
                  
                  <!-- 已选择的文档-->
                  <div v-if="selectedDocuments.length > 0" class="mt-3 space-y-2">
                    <div
                      v-for="(file, index) in selectedDocuments"
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
                          @click="removeFile('document', index)"
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

            <!-- GPS定位 -->
            <div v-if="requiresGPS" class="pt-4 border-t-2 border-black/20">
              <label class="block font-pixel text-xs uppercase text-black mb-2">
                GPS定位 <span class="text-mario-red">*</span>
              </label>
              <div class="bg-white border-2 border-black shadow-pixel-sm p-4">
                <div v-if="!gpsLocation.latitude || !gpsLocation.longitude" class="space-y-3">
                  <p class="font-vt323 text-base text-black mb-3">
                    此任务需要GPS定位验证，请点击按钮获取您的位置
                  </p>
                  <PixelButton
                    @click="getGPSLocation"
                    variant="primary"
                    size="md"
                    :disabled="isGettingGPS"
                    :block="false"
                  >
                    {{ isGettingGPS ? '获取中...' : '📍 获取GPS位置' }}
                </PixelButton>
                <p v-if="gpsError" class="font-vt323 text-xs text-mario-red mt-2">
                  ⚠️ {{ gpsError }}
                </p>
                </div>
                <div v-else class="space-y-2">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-2xl">✅</span>
                    <span class="font-pixel text-xs uppercase text-black">GPS位置已获取</span>
                  </div>
                  <div class="font-vt323 text-sm text-black space-y-1">
                    <p><span class="font-medium">纬度：</span> {{ gpsLocation.latitude?.toFixed(6) }}</p>
                    <p><span class="font-medium">经度：</span> {{ gpsLocation.longitude?.toFixed(6) }}</p>
                    <p v-if="gpsLocation.accuracy !== null">
                      <span class="font-medium">精度:</span>{{ gpsLocation.accuracy.toFixed(2) }} 米
                    </p>
                </div>
                <PixelButton
                  @click="getGPSLocation"
                  variant="secondary"
                  size="sm"
                  :disabled="isGettingGPS"
                  :block="false"
                  class="mt-2"
                >
                  {{ isGettingGPS ? '重新获取中...' : '🔄 重新获取位置' }}
              </PixelButton>
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
                :placeholder="task.proofConfig?.description?.prompt || '请详细描述您完成的任务内容，包括主要工作、技术实现、遇到的问题和解决方案等...'"
                rows="6"
                class="w-full px-4 py-3 bg-white border-2 border-black shadow-pixel-sm font-vt323 text-base text-black focus:outline-none focus:shadow-pixel focus:-translate-y-1 transition-all resize-none"
                :class="{'border-mario-red': requiresDescription && !isValidDescription }"
              />
              <!-- 字数提示 -->
              <div v-if="requiresDescription" class="mt-2">
                <p class="font-vt323 text-xs" :class="isValidDescription ? 'text-black/60' : 'text-mario-red'">
                  最少字数： {{ minWords }} 字
                  <span v-if="currentCharCount > 0">
                    （当前： {{ currentCharCount }} 字）
                  </span>
                </p>
                <p v-if="!isValidDescription && currentCharCount > 0" class="font-vt323 text-xs text-mario-red mt-1">
                  ⚠️ 字数不足，请至少输入 {{ minWords }} 字
                </p>
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
const selectedPhotos = ref<File[]>([])
const selectedDocuments = ref<File[]>([])
const submissionDescription = ref('')
const isSubmitting = ref(false)
const dragOver = ref(false)

// 文件输入引用
const photoFileInput = ref<HTMLInputElement | null>(null)
const documentFileInput = ref<HTMLInputElement | null>(null)

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

// GPS位置数据
const gpsLocation = ref
<{
  latitude :number | null
  longitude : number |null
  accuracy: number | null
  timestamp: number | null
}>
({
  latitude: null,
  longitude: null,
  accuracy: null,
  timestamp: null
})

// GPS获取状态
const isGettingGPS = ref(false)
const gpsError = ref<string | null>(null)

// 获取GPS位置
const getGPSLocation = async () => {
  isGettingGPS.value = true
  gpsError.value = null

  try {
    const gpsData = await getCurrentLocation()

    // 验证GPS精度
    if(task.value.proofConfig?.gps?.accuracy)
   {
      const requiredAccuracy = task.value.proofConfig.gps.accuracy || 'medium'
      if (!validateGPSAccuracy(gpsData.accuracy, requiredAccuracy))
      {
        gpsError.value = `GPS精度不足（当前：${gpsData.accuracy.toFixed(2)}米，要求：${requiredAccuracy})`
        isGettingGPS.value = false
        return 
      }
   }

   // 保存GPS位置
   gpsLocation.value = {
    latitude: gpsData.latitude,
    longitude: gpsData.longitude,
    accuracy: gpsData.accuracy,
    timestamp: Date.now()
   }

   toast.add
   ({
    title: 'GPS位置获取成功',
    description: '位置信息已保存',
    color: 'green'
  })
} catch (error: any)
{
  console.error('获取GPS位置失败:',error)
  gpsError.value = error.message || '获取GPS位置失败，请检查定位权限'
  toast.add 
  ({
    title: '获取GPS位置失败',
    description: error.message || '无法获取GPS位置，请检查定位权限',
    color: 'red'
  })
} finally
{
  isGettingGPS.value = false
}
}

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

// 检查是否需要文字描述
const requiresDescription = computed 
(
  () => 
{
  return task.value.proofConfig?.description?.enabled === true
}
)

// 获取最少字数要求
const minWords = computed 
(
  () =>
{
  return task.value.proofConfig?.description?.minWords || 20
}
)

// 当前输入的字数
const currentCharCount = computed 
(
  () =>
{
  return submissionDescription.value.trim().length
}
)

// 验证字数是否满足要求
const isValidDescription = computed 
(
  () =>
{
  if (!requiresDescription.value) return true
  return currentCharCount.value >= minWords.value
}
)

// 检查是否需要照片上传
const requiresPhoto = computed(() => {
  return task.value.proofConfig?.photo?.enabled === true
})

// 检查是否需要文件上传（照片或文档）
const requiresFileUpload = computed(() => {
  return requiresPhoto.value || allowsDocuments.value
})

// 检查是否允许文档上传
const allowsDocuments = computed(()=>{
  // 默认允许文档上传
  return true
})

// 检查是否需要GPS定位
const requiresGPS = computed(() => {
  return task.value.proofConfig?.gps?.enabled === true
})

// 计算属性
const canSubmit = computed 
(
  () =>
{
  // 如果需要文件上传
  if (requiresFileUpload.value)
 {
    // 如果要求照片，必须至少有一张照片
    const hasPhoto = requiresPhoto.value ? selectedPhotos.value.length > 0 : true
    // 如果要求文档（且不要求照片），必须至少有一个文档
    const hasDocument = (!requiresPhoto.value && allowsDocuments.value)
      ? selectedDocuments.value.length > 0
      : true
    const hasGPS = requiresGPS.value ? (gpsLocation.value.latitude !== null && gpsLocation.value.longitude !== null) : true
    const hasDescription = requiresDescription.value ? isValidDescription.value : true
    return hasPhoto && hasDocument && hasGPS && hasDescription
 }

 // 如果需要GPS定位，必须获取位置
 if (requiresGPS.value)
 {
  const hasGPS = gpsLocation.value.latitude !== null && gpsLocation.value.longitude !== null
  const hasDescription = requiresDescription.value ? isValidDescription.value : true
  return hasGPS && hasDescription
 }

 // 如果需要文字描述，必须填写说明并满足最小字数
 if (requiresDescription.value)
 {
  return isValidDescription.value
 }

 // 如果没有任何要求，至少需要文件或文字描述中的一种
 const hasFiles = selectedPhotos.value.length > 0 || selectedDocuments.value.length > 0
 return hasFiles || submissionDescription.value.trim().length > 0
}
)


// 触发文件输入
const triggerFileInput = (type: 'photo' | 'document') => {
  if (type === 'photo') {
    photoFileInput.value?.click()
  } else {
    documentFileInput.value?.click()
  }
}

// 处理文件选择
const handleFileSelect = (event: Event, type: 'photo' | 'document') => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])

  if (type === 'photo') {
    // 验证是否为图片
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    selectedPhotos.value = [...selectedPhotos.value, ...imageFiles]
  } else {
    // 验证是否为文档
    const docFiles = files.filter
    (
      file =>
      file.type === 'application/pdf' || 
      file.type.includes('document') ||
      file.name.match(/\.(pdf|doc|docx)$/i)
    )
    selectedDocuments.value = [...selectedDocuments.value, ...docFiles]
  }

  // 清空 input，允许重复选择同一文件
  target.value = ''
}

// 处理文件拖拽
const handleFileDrop = (event: DragEvent, type: 'photo' | 'document') => {
  dragOver.value = false
  const files = Array.from(event.dataTransfer?.files || [])
  if (type === 'photo') {
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    selectedPhotos.value = [...selectedPhotos.value, ...imageFiles]
  } else {
    const docFiles = files.filter
    (
      file =>
      file.type === 'application/pdf' ||
      file.type.includes('document') ||
      file.name.match(/\.(pdf|doc|docx)$/i)
    )
    selectedDocuments.value = [...selectedDocuments.value, ...docFiles]
  }
}

// 移除文件
const removeFile = (type: 'photo' | 'document', index: number) => {
  if (type === 'photo') {
    selectedPhotos.value.splice(index, 1)
  } else {
    selectedDocuments.value.splice(index, 1)
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
      // 如果已经获取过GPS位置，直接使用
      if (gpsLocation.value.latitude !== null && gpsLocation.value.longitude !== null) {
        gpsData = {
          latitude: gpsLocation.value.latitude,
          longitude: gpsLocation.value.longitude,
          accuracy: gpsLocation.value.accuracy || 0,
          timestamp: new Date(gpsLocation.value.timestamp || Date.now()).toISOString()
        }
      } else {
        // 如果没有获取过，则重新获取
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
    }

    // 上传文件到后端
    const filesToUpload: File[] = []
    filesToUpload.push(...selectedPhotos.value)
    filesToUpload.push(...selectedDocuments.value)

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
