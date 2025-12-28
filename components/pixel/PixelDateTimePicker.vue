<template>
  <div class="relative" ref="containerRef">
    <!-- 日期时间显示和触发按钮 -->
    <div
      @click="togglePicker"
      class="w-full h-12 px-4 bg-white border-2 border-black shadow-pixel-sm font-vt323 text-lg cursor-pointer hover:shadow-pixel hover:-translate-y-1 transition-all flex items-center justify-between"
      :class="{ 'border-mario-red': error }"
    >
      <span :class="displayDateTime ? 'text-black' : 'text-gray-400'">
        {{ displayDateTime || placeholder }}
      </span>
      <div class="flex items-center gap-2">
        <span class="text-xl">📅</span>
        <span 
          class="text-xs font-pixel text-black/60 cursor-pointer hover:text-black"
          @click.stop="openNativePicker"
          title="显示当地日期和时间选择器"
        >
          🕐
        </span>
      </div>
    </div>

    <!-- 日期时间选择器弹出层 -->
    <div
      v-if="isOpen"
      ref="pickerRef"
      class="absolute top-full left-0 mt-2 z-50 bg-white border-2 border-black shadow-pixel-lg p-4"
      style="min-width: 320px;"
    >
      <!-- 日期选择部分 -->
      <div class="mb-4">
        <!-- 月份/年份导航 -->
        <div class="flex items-center justify-between mb-4">
          <PixelButton
            @click="previousMonth"
            variant="secondary"
            size="sm"
          >
            ←
          </PixelButton>
          <div class="font-pixel text-xs uppercase text-black">
            {{ currentYear }}年 {{ currentMonth + 1 }}月
          </div>
          <PixelButton
            @click="nextMonth"
            variant="secondary"
            size="sm"
          >
            →
          </PixelButton>
        </div>

        <!-- 星期标题 -->
        <div class="grid grid-cols-7 gap-1 mb-2">
          <div
            v-for="day in weekDays"
            :key="day"
            class="text-center font-pixel text-[10px] uppercase text-black py-1"
          >
            {{ day }}
          </div>
        </div>

        <!-- 日期网格 -->
        <div class="grid grid-cols-7 gap-1">
          <!-- 空白占位符 -->
          <div
            v-for="i in firstDayOfMonth"
            :key="`empty-${i}`"
            class="aspect-square"
          ></div>

          <!-- 日期单元格 -->
          <button
            v-for="day in daysInMonth"
            :key="day"
            @click="selectDate(day)"
            :disabled="isDateDisabled(day)"
            class="aspect-square border-2 border-black font-vt323 text-base transition-all hover:-translate-y-0.5 hover:shadow-pixel-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            :class="getDateClass(day)"
          >
            {{ day }}
          </button>
        </div>
      </div>

      <!-- 时间选择部分 -->
      <div class="border-t-2 border-black pt-4">
        <div class="font-pixel text-[10px] uppercase text-black mb-2 text-center">时间</div>
        <div class="flex items-center gap-2 justify-center">
          <!-- 小时选择 -->
          <div class="flex flex-col items-center">
            <div class="font-pixel text-[10px] uppercase text-black mb-1">时</div>
            <div class="border-2 border-black max-h-32 overflow-y-auto time-scroll bg-white">
              <button
                v-for="h in 24"
                :key="h"
                @click="selectHour(h - 1)"
                class="w-12 px-2 py-1 border-b border-black/10 font-vt323 text-base transition-all hover:bg-gray-100"
                :class="selectedHour === h - 1 ? 'bg-mario-blue text-white' : 'bg-white text-black'"
              >
                {{ String(h - 1).padStart(2, '0') }}
              </button>
            </div>
          </div>

          <span class="font-vt323 text-xl text-black mt-6">:</span>

          <!-- 分钟选择 -->
          <div class="flex flex-col items-center">
            <div class="font-pixel text-[10px] uppercase text-black mb-1">分</div>
            <div class="border-2 border-black max-h-32 overflow-y-auto time-scroll bg-white">
              <button
                v-for="m in 60"
                :key="m"
                @click="selectMinute(m - 1)"
                class="w-12 px-2 py-1 border-b border-black/10 font-vt323 text-base transition-all hover:bg-gray-100"
                :class="selectedMinute === m - 1 ? 'bg-mario-blue text-white' : 'bg-white text-black'"
              >
                {{ String(m - 1).padStart(2, '0') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex gap-2 mt-4 pt-4 border-t-2 border-black">
        <PixelButton
          @click="clearDateTime"
          variant="secondary"
          size="sm"
          class="flex-1"
        >
          清除
        </PixelButton>
        <PixelButton
          @click="selectToday"
          variant="secondary"
          size="sm"
          class="flex-1"
        >
          今天
        </PixelButton>
        <PixelButton
          @click="confirmSelection"
          variant="success"
          size="sm"
          class="flex-1"
        >
          确定
        </PixelButton>
      </div>

      <!-- 错误提示 -->
      <p v-if="error" class="mt-2 font-vt323 text-xs text-mario-red">
        {{ error }}
      </p>
    </div>

    <!-- 隐藏的原生 input 用于触发原生选择器 -->
    <input
      ref="nativeInputRef"
      type="datetime-local"
      :min="min"
      class="hidden"
      @change="handleNativeInput"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import PixelButton from './PixelButton.vue'

interface Props {
  modelValue?: string
  placeholder?: string
  min?: string
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '年 / 月 / 日 --:--',
  min: '',
  error: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isOpen = ref(false)
const currentDate = ref(new Date())
const selectedDate = ref<Date | null>(null)
const selectedHour = ref(0)
const selectedMinute = ref(0)
const pickerRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const nativeInputRef = ref<HTMLInputElement | null>(null)

const weekDays = ['日', '一', '二', '三', '四', '五', '六']

const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth())

const daysInMonth = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  return new Date(year, month + 1, 0).getDate()
})

const firstDayOfMonth = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  return new Date(year, month, 1).getDay()
})

const displayDateTime = computed(() => {
  if (!props.modelValue) return ''
  // 统一处理本地时间格式 YYYY-MM-DDTHH:mm，直接解析字符串
  const [datePart, timePart] = props.modelValue.split('T')
  if (!datePart || !timePart) {
    // 如果不是标准格式，尝试用 Date 对象解析（兼容 ISO 格式）
    const date = new Date(props.modelValue)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hour = String(date.getHours()).padStart(2, '0')
    const minute = String(date.getMinutes()).padStart(2, '0')
    return `${year} / ${month} / ${day} ${hour}:${minute}`
  }
  // 直接解析本地时间格式 YYYY-MM-DDTHH:mm
  const [year, month, day] = datePart.split('-')
  const [hour, minute] = timePart.split(':')
  return `${year} / ${month} / ${day} ${hour}:${minute}`
})

// 监听 modelValue 变化
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    // 解析本地时间格式 YYYY-MM-DDTHH:mm，直接解析字符串避免时区问题
    const [datePart, timePart] = newValue.split('T')
    if (datePart && timePart) {
      const [year, month, day] = datePart.split('-').map(Number)
      const [hour, minute] = timePart.split(':').map(Number)
      selectedDate.value = new Date(year, month - 1, day, hour, minute)
      currentDate.value = new Date(year, month - 1, 1)
      selectedHour.value = hour
      selectedMinute.value = minute
    } else {
      // 兼容旧格式，使用 Date 对象解析
      const date = new Date(newValue)
      selectedDate.value = date
      currentDate.value = new Date(date.getFullYear(), date.getMonth(), 1)
      selectedHour.value = date.getHours()
      selectedMinute.value = date.getMinutes()
    }
  } else {
    selectedDate.value = null
    selectedHour.value = 0
    selectedMinute.value = 0
  }
}, { immediate: true })

const togglePicker = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value && selectedDate.value) {
    scrollToSelected()
  }
}

const closePicker = () => {
  isOpen.value = false
}

const previousMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
}

const isDateDisabled = (day: number): boolean => {
  if (!props.min) return false
  const checkDate = new Date(currentYear.value, currentMonth.value, day)
  const minDate = new Date(props.min)
  minDate.setHours(0, 0, 0, 0)
  checkDate.setHours(0, 0, 0, 0)
  return checkDate < minDate
}

const getDateClass = (day: number) => {
  const checkDate = new Date(currentYear.value, currentMonth.value, day)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  checkDate.setHours(0, 0, 0, 0)

  const isToday = checkDate.getTime() === today.getTime()
  const isSelected = selectedDate.value &&
    checkDate.getTime() === new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth(), selectedDate.value.getDate()).getTime()

  if (isSelected) {
    return 'bg-mario-blue text-white'
  }
  if (isToday) {
    return 'bg-mario-yellow text-black'
  }
  return 'bg-white text-black hover:bg-gray-100'
}

const selectDate = (day: number) => {
  const date = new Date(currentYear.value, currentMonth.value, day)
  if (!selectedDate.value) {
    selectedDate.value = new Date(date)
    selectedDate.value.setHours(selectedHour.value)
    selectedDate.value.setMinutes(selectedMinute.value)
  } else {
    selectedDate.value.setFullYear(date.getFullYear())
    selectedDate.value.setMonth(date.getMonth())
    selectedDate.value.setDate(date.getDate())
  }
}

const selectHour = (hour: number) => {
  selectedHour.value = hour
  if (!selectedDate.value) {
    selectedDate.value = new Date()
    selectedDate.value.setHours(hour)
    selectedDate.value.setMinutes(selectedMinute.value)
  } else {
    selectedDate.value.setHours(hour)
  }
}

const selectMinute = (minute: number) => {
  selectedMinute.value = minute
  if (!selectedDate.value) {
    selectedDate.value = new Date()
    selectedDate.value.setHours(selectedHour.value)
    selectedDate.value.setMinutes(minute)
  } else {
    selectedDate.value.setMinutes(minute)
  }
}

const confirmSelection = () => {
  if (!selectedDate.value) {
    selectedDate.value = new Date()
  }
  
  selectedDate.value.setHours(selectedHour.value)
  selectedDate.value.setMinutes(selectedMinute.value)
  selectedDate.value.setSeconds(0, 0)

  // 格式化为 YYYY-MM-DDTHH:mm
  const year = selectedDate.value.getFullYear()
  const month = String(selectedDate.value.getMonth() + 1).padStart(2, '0')
  const day = String(selectedDate.value.getDate()).padStart(2, '0')
  const hour = String(selectedHour.value).padStart(2, '0')
  const minute = String(selectedMinute.value).padStart(2, '0')
  const dateTimeString = `${year}-${month}-${day}T${hour}:${minute}`

  emit('update:modelValue', dateTimeString)
  closePicker()
}

const clearDateTime = () => {
  selectedDate.value = null
  selectedHour.value = 0
  selectedMinute.value = 0
  emit('update:modelValue', '')
  closePicker()
}

const selectToday = () => {
  const today = new Date()
  selectedDate.value = new Date(today)
  currentDate.value = new Date(today.getFullYear(), today.getMonth(), 1)
  selectedHour.value = today.getHours()
  selectedMinute.value = today.getMinutes()
}

const openNativePicker = () => {
  if (nativeInputRef.value) {
    nativeInputRef.value.focus()
    if (typeof nativeInputRef.value.showPicker === 'function') {
      nativeInputRef.value.showPicker()
    } else {
      nativeInputRef.value.click()
    }
  }
}

const handleNativeInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.value) {
    emit('update:modelValue', target.value)
  }
}

const scrollToSelected = () => {
  // 滚动到选中的时间
  setTimeout(() => {
    const hourButtons = pickerRef.value?.querySelectorAll('.time-scroll button')
    if (hourButtons && hourButtons[selectedHour.value]) {
      hourButtons[selectedHour.value].scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
    const minuteButtons = pickerRef.value?.querySelectorAll('.time-scroll button')
    if (minuteButtons && minuteButtons[selectedMinute.value]) {
      minuteButtons[selectedMinute.value].scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }, 100)
}

// 点击外部关闭
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node
  if (containerRef.value && !containerRef.value.contains(target)) {
    closePicker()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  if (props.modelValue) {
    const date = new Date(props.modelValue)
    if (nativeInputRef.value) {
      nativeInputRef.value.value = props.modelValue
    }
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.time-scroll {
  scrollbar-width: thin;
  scrollbar-color: #000 #fff;
}

.time-scroll::-webkit-scrollbar {
  width: 8px;
}

.time-scroll::-webkit-scrollbar-track {
  background: #fff;
  border: 1px solid #000;
}

.time-scroll::-webkit-scrollbar-thumb {
  background: #000;
  border: 1px solid #000;
}

.time-scroll::-webkit-scrollbar-thumb:hover {
  background: #333;
}
</style>
