<template>
  <div class="relative w-full" ref="containerRef">
    <!-- 时间显示和触发按钮 -->
    <div
      @click="toggleTimePicker"
      class="w-full h-10 px-3 bg-white border-2 border-black shadow-pixel-sm font-vt323 text-base cursor-pointer hover:shadow-pixel hover:-translate-y-1 transition-all flex items-center justify-between"
    >
      <span :class="displayTime ? 'text-black' : 'text-gray-400'">
        {{ displayTime || '00:00' }}
      </span>
      <span class="text-sm">🕐</span>
    </div>

    <!-- 时间选择弹出层 -->
    <div
      v-if="isOpen"
      ref="timePickerRef"
      class="absolute top-full left-0 mt-2 z-50 bg-white border-2 border-black shadow-pixel-lg p-4 w-64"
    >
      <div class="flex items-center gap-2">
        <!-- 小时选择 -->
        <div class="flex-1">
          <div class="font-pixel text-[10px] uppercase text-black mb-2 text-center">小时</div>
          <div class="border-2 border-black max-h-48 overflow-y-auto time-scroll" ref="hourScrollRef">
            <button
              v-for="h in 24"
              :key="h"
              @click="selectHour(h - 1)"
              :class="[
                'w-full px-3 py-2 border-b border-black/10 font-vt323 text-base transition-all hover:bg-gray-100',
                selectedHour === String(h - 1).padStart(2, '0') ? 'bg-mario-green text-white' : 'bg-white text-black'
              ]"
            >
              {{ String(h - 1).padStart(2, '0') }}
            </button>
          </div>
        </div>

        <!-- 分隔符 -->
        <div class="flex items-center pt-6">
          <span class="font-vt323 text-lg text-black">:</span>
        </div>

        <!-- 分钟选择 -->
        <div class="flex-1">
          <div class="font-pixel text-[10px] uppercase text-black mb-2 text-center">分钟</div>
          <div class="border-2 border-black max-h-48 overflow-y-auto time-scroll" ref="minuteScrollRef">
            <button
              v-for="m in 60"
              :key="m"
              @click="selectMinute(m - 1)"
              :class="[
                'w-full px-3 py-2 border-b border-black/10 font-vt323 text-base transition-all hover:bg-gray-100',
                selectedMinute === String(m - 1).padStart(2, '0') ? 'bg-mario-green text-white' : 'bg-white text-black'
              ]"
            >
              {{ String(m - 1).padStart(2, '0') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const selectedHour = ref('00')
const selectedMinute = ref('00')
const timePickerRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const hourScrollRef = ref<HTMLElement | null>(null)
const minuteScrollRef = ref<HTMLElement | null>(null)

// 显示时间
const displayTime = computed(() => {
  return `${selectedHour.value}:${selectedMinute.value}`
})

// 从 modelValue 解析时间（格式：HH:mm）
const parseTime = (value: string) => {
  if (!value) {
    const now = new Date()
    return {
      hour: String(now.getHours()).padStart(2, '0'),
      minute: String(now.getMinutes()).padStart(2, '0')
    }
  }
  
  // 只支持 HH:mm 格式
  if (value.includes(':')) {
    const [hour, minute] = value.split(':')
    return {
      hour: hour || '00',
      minute: minute || '00'
    }
  }
  
  return { hour: '00', minute: '00' }
}

// 监听 modelValue 变化
watch(() => props.modelValue, (newValue) => {
  const time = parseTime(newValue)
  selectedHour.value = time.hour
  selectedMinute.value = time.minute
}, { immediate: true })

// 监听打开状态，自动滚动到选中项
watch(isOpen, async (open) => {
  if (open) {
    await nextTick()
    scrollToSelected()
  }
})

const toggleTimePicker = () => {
  isOpen.value = !isOpen.value
}

const closeTimePicker = () => {
  isOpen.value = false
}

const selectHour = (hour: number) => {
  selectedHour.value = String(hour).padStart(2, '0')
  updateTime()
}

const selectMinute = (minute: number) => {
  selectedMinute.value = String(minute).padStart(2, '0')
  updateTime()
}

const updateTime = () => {
  const timeString = `${selectedHour.value}:${selectedMinute.value}`
  emit('update:modelValue', timeString)
}

// 滚动到选中项
const scrollToSelected = () => {
  if (hourScrollRef.value) {
    const hourIndex = parseInt(selectedHour.value)
    const hourButton = hourScrollRef.value.children[hourIndex] as HTMLElement
    if (hourButton) {
      hourScrollRef.value.scrollTop = hourButton.offsetTop - hourScrollRef.value.offsetTop - 20
    }
  }
  
  if (minuteScrollRef.value) {
    const minuteIndex = parseInt(selectedMinute.value)
    const minuteButton = minuteScrollRef.value.children[minuteIndex] as HTMLElement
    if (minuteButton) {
      minuteScrollRef.value.scrollTop = minuteButton.offsetTop - minuteScrollRef.value.offsetTop - 20
    }
  }
}

// 点击外部关闭
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node
  if (containerRef.value && !containerRef.value.contains(target)) {
    closeTimePicker()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  if (!props.modelValue) {
    const now = new Date()
    selectedHour.value = String(now.getHours()).padStart(2, '0')
    selectedMinute.value = String(now.getMinutes()).padStart(2, '0')
    updateTime()
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* 自定义滚动条样式（像素风格） */
.time-scroll::-webkit-scrollbar {
  width: 8px;
}

.time-scroll::-webkit-scrollbar-track {
  background: #000000;
  border: 1px solid #000000;
}

.time-scroll::-webkit-scrollbar-thumb {
  background: #ffcc00;
  border: 1px solid #000000;
}

.time-scroll::-webkit-scrollbar-thumb:hover {
  background: #ffaa00;
}

/* Firefox 滚动条样式 */
.time-scroll {
  scrollbar-width: thin;
  scrollbar-color: #ffcc00 #000000;
}
</style>