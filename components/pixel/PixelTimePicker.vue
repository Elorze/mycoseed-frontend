<template>
  <div class="w-full">
    <div class="grid grid-cols-2 gap-2">
      <!-- 小时选择 -->
      <div>
        <label class="block font-pixel text-[10px] uppercase mb-1 text-black">小时</label>
        <select
          v-model="selectedHour"
          @change="updateTime"
          class="w-full h-12 px-3 bg-white border-2 border-black shadow-pixel-sm font-vt323 text-lg focus:outline-none focus:shadow-pixel focus:-translate-y-1 transition-all"
        >
          <option v-for="h in 24" :key="h" :value="String(h - 1).padStart(2, '0')">
            {{ String(h - 1).padStart(2, '0') }}
          </option>
        </select>
      </div>

      <!-- 分钟选择 -->
      <div>
        <label class="block font-pixel text-[10px] uppercase mb-1 text-black">分钟</label>
        <select
          v-model="selectedMinute"
          @change="updateTime"
          class="w-full h-12 px-3 bg-white border-2 border-black shadow-pixel-sm font-vt323 text-lg focus:outline-none focus:shadow-pixel focus:-translate-y-1 transition-all"
        >
          <option v-for="m in 60" :key="m" :value="String(m - 1).padStart(2, '0')">
            {{ String(m - 1).padStart(2, '0') }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const selectedHour = ref('00')
const selectedMinute = ref('00')

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

const updateTime = () => {
  const timeString = `${selectedHour.value}:${selectedMinute.value}`
  emit('update:modelValue', timeString)
}

onMounted(() => {
  if (!props.modelValue) {
    const now = new Date()
    selectedHour.value = String(now.getHours()).padStart(2, '0')
    selectedMinute.value = String(now.getMinutes()).padStart(2, '0')
    updateTime()
  }
})
</script>
