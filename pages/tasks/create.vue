<template>
  <div class="min-h-screen bg-mario-sky py-4 md:py-8">
    <div class="container mx-auto px-4 md:px-6 max-w-4xl pb-32 md:pb-24">
      <!-- 页面标题 -->
      <div class="mb-6 md:mb-8 text-center">
        <h1 class="font-pixel text-2xl md:text-4xl text-white text-shadow-pixel mb-2 md:mb-4">创建任务</h1>
        <div class="w-24 md:w-32 h-1 bg-white mx-auto border-2 border-black"></div>
      </div>

      <!-- 任务创建表单 -->
      <PixelCard>
        <div class="space-y-4 md:space-y-6">
          <!-- 基本信息 -->
          <div class="space-y-4">
            <div>
              <label class="block font-pixel text-xs uppercase mb-2 text-black">任务标题 *</label>
              <input 
                v-model="taskForm.title" 
                type="text"
                placeholder="输入任务标题..."
                class="w-full h-12 px-4 bg-white border-2 border-black shadow-pixel-sm font-vt323 text-lg focus:outline-none focus:shadow-pixel focus:-translate-y-1 transition-all"
              />
            </div>

            <div>
              <label class="block font-pixel text-xs uppercase mb-2 text-black">任务目标 *</label>
              <textarea 
                v-model="taskForm.objective" 
                placeholder="描述任务的具体目标..."
                rows="4"
                class="w-full px-4 py-3 bg-white border-2 border-black shadow-pixel-sm font-vt323 text-lg focus:outline-none focus:shadow-pixel focus:-translate-y-1 transition-all resize-none"
              ></textarea>
            </div>

            <!-- 移动端单列，桌面端双列 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block font-pixel text-xs uppercase mb-2 text-black">奖励积分 *</label>
                <input 
                  v-model="taskForm.reward" 
                  type="number"
                  step="1"
                  min="1"
                  placeholder="100"
                  class="w-full h-12 px-4 bg-white border-2 border-black shadow-pixel-sm font-vt323 text-lg focus:outline-none focus:shadow-pixel focus:-translate-y-1 transition-all"
                />
              </div>

              <div>
                <label class="block font-pixel text-xs uppercase mb-2 text-black">开始日期 *</label>
                <input 
                  v-model="taskForm.startDate" 
                  type="datetime-local"
                  class="w-full h-12 px-4 bg-white border-2 border-black shadow-pixel-sm font-vt323 text-lg focus:outline-none focus:shadow-pixel focus:-translate-y-1 transition-all"
                />
              </div>
            </div>

            <div>
              <label class="block font-pixel text-xs uppercase mb-2 text-black">截止日期 *</label>
              <input 
                v-model="taskForm.deadline" 
                type="datetime-local"
                class="w-full h-12 px-4 bg-white border-2 border-black shadow-pixel-sm font-vt323 text-lg focus:outline-none focus:shadow-pixel focus:-translate-y-1 transition-all"
              />
            </div>
          </div>

          <!-- 证明要求配置 -->
          <div class="border-t-2 border-black pt-4 md:pt-6">
            <h3 class="font-pixel text-sm uppercase mb-4 text-black">证明要求配置</h3>
            <div class="space-y-3 md:space-y-4">
              <!-- 照片证据 -->
              <div class="p-3 md:p-4 bg-gray-50 border-2 border-black shadow-pixel-sm">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-3">
                    <span class="text-xl md:text-2xl">📷</span>
                    <h4 class="font-pixel text-xs uppercase text-black">照片证据</h4>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      v-model="proofConfig.photo.enabled"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black border-2 border-black peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-2 after:border-black after:h-5 after:w-5 after:transition-all peer-checked:bg-mario-green"></div>
                  </label>
                </div>
                
                <div v-if="proofConfig.photo.enabled" class="space-y-3 mt-3">
                  <div>
                    <label class="block font-pixel text-[10px] uppercase mb-1 text-black">照片数量</label>
                    <select 
                      v-model="proofConfig.photo.count"
                      class="w-full h-10 px-3 bg-white border-2 border-black shadow-pixel-sm font-vt323 text-base focus:outline-none focus:shadow-pixel focus:-translate-y-1 transition-all"
                    >
                      <option v-for="opt in photoCountOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="block font-pixel text-[10px] uppercase mb-1 text-black">要求说明</label>
                    <textarea 
                      v-model="proofConfig.photo.requirements"
                      placeholder="描述照片的具体要求..."
                      rows="2"
                      class="w-full px-3 py-2 bg-white border-2 border-black shadow-pixel-sm font-vt323 text-base focus:outline-none focus:shadow-pixel focus:-translate-y-1 transition-all resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              <!-- GPS定位 -->
              <div class="p-3 md:p-4 bg-gray-50 border-2 border-black shadow-pixel-sm">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-3">
                    <span class="text-xl md:text-2xl">📍</span>
                    <h4 class="font-pixel text-xs uppercase text-black">GPS 定位</h4>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      v-model="proofConfig.gps.enabled"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black border-2 border-black peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-2 after:border-black after:h-5 after:w-5 after:transition-all peer-checked:bg-mario-green"></div>
                  </label>
                </div>
                
                <div v-if="proofConfig.gps.enabled" class="mt-3">
                  <label class="block font-pixel text-[10px] uppercase mb-1 text-black">定位精度</label>
                  <select 
                    v-model="proofConfig.gps.accuracy"
                    class="w-full h-10 px-3 bg-white border-2 border-black shadow-pixel-sm font-vt323 text-base focus:outline-none focus:shadow-pixel focus:-translate-y-1 transition-all"
                  >
                    <option v-for="opt in gpsAccuracyOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                  </select>
                </div>
              </div>

              <!-- 文字描述 -->
              <div class="p-3 md:p-4 bg-gray-50 border-2 border-black shadow-pixel-sm">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-3">
                    <span class="text-xl md:text-2xl">📝</span>
                    <h4 class="font-pixel text-xs uppercase text-black">文字描述</h4>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      v-model="proofConfig.description.enabled"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black border-2 border-black peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-2 after:border-black after:h-5 after:w-5 after:transition-all peer-checked:bg-mario-green"></div>
                  </label>
                </div>
                
                <div v-if="proofConfig.description.enabled" class="space-y-3 mt-3">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block font-pixel text-[10px] uppercase mb-1 text-black">最少字数</label>
                      <input 
                        v-model="proofConfig.description.minWords"
                        type="number"
                        placeholder="50"
                        class="w-full h-10 px-3 bg-white border-2 border-black shadow-pixel-sm font-vt323 text-base focus:outline-none focus:shadow-pixel focus:-translate-y-1 transition-all"
                      />
                    </div>
                    <div>
                      <label class="block font-pixel text-[10px] uppercase mb-1 text-black">提示语</label>
                      <input 
                        v-model="proofConfig.description.prompt"
                        type="text"
                        placeholder="请描述..."
                        class="w-full h-10 px-3 bg-white border-2 border-black shadow-pixel-sm font-vt323 text-base focus:outline-none focus:shadow-pixel focus:-translate-y-1 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 底部固定操作栏占位符，防止内容被遮挡 -->
          <div class="h-20 md:h-16"></div>
        </div>
      </PixelCard>
    </div>

    <!-- 底部固定操作栏 -->
    <!-- 移动端：放在底部导航栏上方（bottom-16），桌面端：放在底部（bottom-0） -->
    <div class="fixed bottom-16 left-0 right-0 p-4 bg-white border-t-2 border-black z-[60] flex gap-3 shadow-[0_-4px_0_rgba(0,0,0,0.05)] md:bottom-0 md:border-t-2" style="padding-bottom: calc(1rem + env(safe-area-inset-bottom));">
      <PixelButton 
        @click="navigateTo('/tasks')"
        variant="secondary"
        size="lg"
        class="w-24"
      >
        取消
      </PixelButton>
      <PixelButton 
        @click="publishTask"
        :disabled="!canPublish || isPublishing"
        variant="success"
        size="lg"
        class="flex-1 flex items-center justify-center gap-2"
      >
        <span v-if="isPublishing" class="animate-spin">⚙️</span>
        <span v-else>💼</span>
        {{ isPublishing ? '发布中...' : '发布任务' }}
      </PixelButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import PixelCard from '~/components/pixel/PixelCard.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'
import { useApi } from '~/composables/useApi'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { createTask } = useApi()

// 任务表单数据
const taskForm = ref({
  title: '',
  objective: '',
  reward: '',
  startDate: '',
  deadline: ''
})

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
const canPublish = computed(() => {
  return taskForm.value.title && 
         taskForm.value.objective && 
         taskForm.value.reward && 
         taskForm.value.startDate && 
         taskForm.value.deadline
})

// 发布任务
const publishTask = async () => {
  if (!canPublish.value) {
    const toast = useToast()
    toast.add({
      title: '请填写完整信息',
      description: '请确保所有必填项都已填写',
      color: 'red'
    })
    return
  }

  isPublishing.value = true
  
  try {
    // 模拟钱包签名和发布
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 创建任务
    const newTask = await createTask({
      title: taskForm.value.title,
      description: taskForm.value.objective,
      reward: parseFloat(taskForm.value.reward),
      startDate: taskForm.value.startDate,
      deadline: taskForm.value.deadline,
      proofConfig: proofConfig.value
    })
    
    // 显示成功消息
    const toast = useToast()
    toast.add({
      title: '任务发布成功！',
      description: '任务已成功发布到区块链网络',
      color: 'green'
    })
    
    // 跳转到任务列表
    await navigateTo('/tasks')
  } catch (error) {
    console.error('发布任务失败:', error)
    const toast = useToast()
    toast.add({
      title: '发布失败',
      description: error instanceof Error ? error.message : '请稍后重试',
      color: 'red'
    })
  } finally {
    isPublishing.value = false
  }
}
</script>

<style scoped>
.text-shadow-pixel {
  text-shadow: 3px 3px 0px rgba(0, 0, 0, 0.3);
}
</style>
