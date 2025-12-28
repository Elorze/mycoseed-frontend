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
              <label class="block font-pixel text-xs uppercase mb-2 text-black">任务名称 *</label>
              <input 
                v-model="taskForm.title" 
                type="text"
                placeholder="输入任务名称"
                class="w-full h-12 px-4 bg-white border-2 border-black shadow-pixel-sm font-vt323 text-lg focus:outline-none focus:shadow-pixel focus:-translate-y-1 transition-all"
              />
            </div>

            <div>
              <label class="block font-pixel text-xs uppercase mb-2 text-black">任务内容 *</label>
              <textarea 
                v-model="taskForm.objective" 
                placeholder="描述任务的具体目标，开始、结束时间，地点等信息..."
                rows="4"
                class="w-full px-4 py-3 bg-white border-2 border-black shadow-pixel-sm font-vt323 text-lg focus:outline-none focus:shadow-pixel focus:-translate-y-1 transition-all resize-none"
              ></textarea>
            </div>

            <!-- 参与人数配置 -->
            <div class="p-3 md:p-4 bg-gray-50 border-2 border-black shadow-pixel-sm">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                  <h4 class="font-pixel text-xs uppercase text-black">限制参与人数</h4>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox"
                    v-model="limitParticipants"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black border-2 border-black peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-2 after:border-black after:h-5 after:w-5 after:transition-all peer-checked:bg-mario-green"></div>
                </label>
              </div>

              <div v-if="limitParticipants" class="space-y-3 mt-3">
                <div>
                  <label class="block font-pixel text-[10px] uppercase mb-1 text-black">参与人数</label>
                  <input 
                    v-model.number="taskForm.participantLimit"
                    type="number"
                    min="1"
                    placeholder="1"
                    class="w-32 h-12 px-3 bg-white border-2 border-black shadow-pixel-sm font-vt323 text-lg focus:outline-none focus:shadow-pixel focus:-translate-y-1 transition-all"
                  />
                </div>
                <p v-if="participantError" class="mt-1 font-vt323 text-xs text-mario-red">
                  {{ participantError }}
                </p>
                <p v-if="!participantError && taskForm.participantLimit" class="mt-2 font-vt323 text-sm text-black/70">
                  最多 {{ taskForm.participantLimit }} 人可以参与此任务
                </p>
              </div>
              <p v-else class="mt-2 font-vt323 text-sm text-black/70">
                默认不限报名人数
              </p>
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
                
                <!-- 奖励分配方式选择器（仅在设置了参与人数上限时显示） -->
                <div v-if="limitParticipants && taskForm.participantLimit" class="mt-3 space-y-2">
                  <label class="block font-pixel text-[10px] uppercase text-black">奖励分配方式</label>
                  <div class="flex gap-3">
                    <label class="flex items-center cursor-pointer">
                      <input 
                        type="radio" 
                        v-model="rewardDistributionMode"
                        value="per_person"
                        class="sr-only peer"
                      />
                      <div class="px-4 py-2 border-2 border-black bg-white shadow-pixel-sm font-vt323 text-sm transition-all peer-checked:bg-mario-green peer-checked:text-white peer-checked:shadow-pixel">
                        每人积分
                      </div>
                    </label>
                    <label class="flex items-center cursor-pointer">
                      <input 
                        type="radio" 
                        v-model="rewardDistributionMode"
                        value="total"
                        class="sr-only peer"
                      />
                      <div class="px-4 py-2 border-2 border-black bg-white shadow-pixel-sm font-vt323 text-sm transition-all peer-checked:bg-mario-green peer-checked:text-white peer-checked:shadow-pixel">
                        总积分
                      </div>
                    </label>
                  </div>
                </div>
                
                <p v-if="rewardExplanation" class="mt-2 font-vt323 text-sm text-black/70">
                  {{ rewardExplanation }}
                </p>
              </div>

              <div>
                <label class="block font-pixel text-xs uppercase mb-2 text-black">报名开始时间 *</label>
                <PixelDateTimePicker
                  v-model="taskForm.startDate" 
                  :min="minStart"
                  :error="dateError"
                />
              </div>
            </div>

            <div>
              <label class="block font-pixel text-xs uppercase mb-2 text-black">提交截止时间 *</label>
              <PixelDateTimePicker
                v-model="taskForm.deadline" 
                :min="taskForm.startDate || minStart"
                :error="dateError"
              />
            </div>
          </div>

          <!-- 提交说明（展示给报名者的信息补充） -->
          <div class="border-t-2 border-black pt-4 md:pt-6">
            <div>
              <label class="block font-pixel text-xs uppercase mb-2 text-black">提交说明（可选）</label>
              <textarea
                v-model="taskForm.submissionInstructions"
                placeholder="补充任务完成后的提交说明，如需要强调的注意事项等..."
                rows="3"
                class="w-full px-4 py-3 bg-white border-2 border-black shadow-pixel-sm font-vt323 text-base text-black focus:outline-none focus:shadow-pixel focus:-translate-y-1 transition-all resize-none"
              ></textarea>
            </div>
          </div>

          <!-- 提交格式 -->
          <div class="border-t-2 border-black pt-4 md:pt-6">
            <h3 class="font-pixel text-sm uppercase mb-4 text-black">提交格式</h3>
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
                    <h4 class="font-pixel text-xs uppercase text-black">位置定位</h4>
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
                        placeholder="10"
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
import { computed, onMounted, ref, watch } from 'vue'
import PixelCard from '~/components/pixel/PixelCard.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'
import PixelDateTimePicker from '~/components/pixel/PixelDateTimePicker.vue'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'

// 参与人数限制
const limitParticipants = ref(false)
const participantError = ref('')
const rewardDistributionMode = ref<'per_person' | 'total'>('total')

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
  deadline: '',
  participantLimit: 1,
  submissionInstructions: ''
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
    minWords: 10,
    prompt: ''
  }
})


// 奖励积分说明文本
const rewardExplanation = computed(() => {
  const reward = parseFloat(taskForm.value.reward) || 0
  if (reward <= 0) {
    return ''
  }
  
  // 不限制人数时，使用总积分模式（默认）
  if (!limitParticipants.value) {
    return `总奖励 ${reward} 积分，将根据实际参与人数平均分配（不限人数）`
  } else {
    const limit = taskForm.value.participantLimit || 1
    
    // 根据分配模式显示不同的说明
    if (rewardDistributionMode.value === 'per_person') {
      // 每人积分模式
      const totalReward = reward * limit
      return `每个完成任务的参与者将获得 ${reward} 积分（共 ${limit} 人，总奖励 ${totalReward} 积分）`
    } else {
      // 总积分模式
      const perPersonReward = Math.floor(reward / limit)
      return `总奖励 ${reward} 积分，将根据实际参与人数平均分配（最多 ${limit} 人，每人最多可获得 ${perPersonReward} 积分）`
    }
  }
})

// 校验参与人数
const validateParticipants = () => {
  participantError.value = ''
  if (!limitParticipants.value) {
    // 不限制人数时忽略具体数值
    taskForm.value.participantLimit = null as unknown as number
    return true
  }
  const value = taskForm.value.participantLimit
  if (!value || value < 1) {
    participantError.value = '参与人数至少为 1 人'
    return false
  }
  return true
}


// 加载状态
const isPublishing = ref(false)

// 日期校验相关
const minStart = ref('')
const dateError = ref('')

// 选项数据
const photoCountOptions = [
  { label: '1张', value: '1' },
  { label: '2张', value: '2' },
  { label: '3张', value: '3' },
  { label: '4张', value: '4' },
  { label: '5张', value: '5' }
]

// 日期校验：开始时间不得早于当前时间，截止时间不得早于开始时间
const validateDates = () => {
  dateError.value = ''
  if (!taskForm.value.startDate || !taskForm.value.deadline) {
    return true
  }

  const now = new Date()
  const start = new Date(taskForm.value.startDate)
  const deadline = new Date(taskForm.value.deadline)

  if (start < now) {
    dateError.value = '开始时间不能早于当前时间'
    return false
  }

  if (deadline < start) {
    dateError.value = '截止时间不能早于开始时间'
    return false
  }

  return true
}

// 监听字段变化做实时校验
watch(() => [taskForm.value.participantLimit, limitParticipants.value], () => {
  validateParticipants()
})

watch(() => [taskForm.value.startDate, taskForm.value.deadline], () => {
  validateDates()
})

// 计算属性
const canPublish = computed(() => {
  return taskForm.value.title && 
         taskForm.value.objective && 
         taskForm.value.reward && 
         taskForm.value.startDate && 
         taskForm.value.deadline &&
         // 参与人数校验：如果限制人数，则必须填写有效的人数
         (
           !limitParticipants.value ||
           (!!taskForm.value.participantLimit && taskForm.value.participantLimit >= 1)
         ) &&
         // 日期关系校验（没有错误信息）
         !dateError.value
})

// 发布任务
const publishTask = async () => {
  // 最终前再做一轮校验，给出明确提示
  const participantsOK = validateParticipants()
  const datesOK = validateDates()

  if (!participantsOK || !datesOK || !canPublish.value) {
    const toast = useToast()
    const description = !participantsOK
      ? (participantError.value || '请检查参与人数配置')
      : (dateError.value || '请确保所有必填项和时间字段填写正确')
    toast.add({
      title: '请检查表单信息',
      description,
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
      participantLimit: !limitParticipants.value ? null : taskForm.value.participantLimit,
      rewardDistributionMode: !limitParticipants.value ? 'total' : rewardDistributionMode.value, // 不限制人数时默认使用总积分模式
      submissionInstructions: taskForm.value.submissionInstructions || '请按照任务要求完成并提交相关凭证。',
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

// 初始化最小开始时间
onMounted(() => {
  const now = new Date()
  now.setSeconds(0, 0)
  // datetime-local 需要到分钟的字符串：YYYY-MM-DDTHH:MM（本地时间格式）
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')
  minStart.value = `${year}-${month}-${day}T${hour}:${minute}`
})
</script>

<style scoped>
.text-shadow-pixel {
  text-shadow: 3px 3px 0px rgba(0, 0, 0, 0.3);
}
</style>
