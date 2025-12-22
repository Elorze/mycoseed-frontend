<template>
  <div class="relative" ref="containerRef">
    <!-- 日期显示和触发按钮 -->
    <div
      @click="toggleCalendar"
      class="w-full h-12 px-4 bg-white border-2 border-black shadow-pixel-sm font-vt323 text-lg cursor-pointer hover:shadow-pixel hover:-translate-y-1 transition-all flex items-center justify-between"
      :class="{ 'border-mario-red': error }"
    >
      <span :class="displayDate ? 'text-black' : 'text-gray-400'">
        {{ displayDate || placeholder }}
      </span>
      <span class="text-xl">📅</span>
    </div>

    <!-- 日历弹出层 -->
    <div
      v-if="isOpen"
      ref="calendarRef"
      class="absolute top-full left-0 mt-2 z-50 bg-white border-2 border-black shadow-pixel-lg p-4 w-80"
    >
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

      <!-- 错误提示 -->
      <p v-if="error" class="mt-2 font-vt323 text-xs text-mario-red">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import PixelButton from './PixelButton.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '选择日期'
  },
  min: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const currentDate = ref(new Date())
const selectedDate = ref<Date | null>(null)
const calendarRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)

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

const displayDate = computed(() => {
  if (!props.modelValue) return ''
  const date = new Date(props.modelValue)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
})

// 监听 modelValue 变化
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    selectedDate.value = new Date(newValue)
    currentDate.value = new Date(newValue)
  } else {
    selectedDate.value = null
  }
}, { immediate: true })

const toggleCalendar = () => {
  isOpen.value = !isOpen.value
}

const closeCalendar = () => {
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
    return 'bg-mario-green text-white'
  }
  if (isToday) {
    return 'bg-mario-yellow text-black'
  }
  return 'bg-white text-black hover:bg-gray-100'
}

const selectDate = (day: number) => {
  const selected = new Date(currentYear.value, currentMonth.value, day)
  selectedDate.value = selected

  // 格式化为 YYYY-MM-DD
  const year = selected.getFullYear()
  const month = String(selected.getMonth() + 1).padStart(2, '0')
  const dayStr = String(selected.getDate()).padStart(2, '0')
  const dateString = `${year}-${month}-${dayStr}`

  emit('update:modelValue', dateString)
  closeCalendar()
}

// 点击外部关闭
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node
  if (containerRef.value && !containerRef.value.contains(target)) {
    closeCalendar()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.pixel-datepicker {
  image-rendering: pixelated;
}
</style>
