<template>
  <div class="relative" ref="containerRef">
    <input 
      :value="modelValue"
      @input="handleInput"
      type="datetime-local"
      :min="min"
      :placeholder="placeholder"
      :class="[
        'w-full h-12 px-4 pr-12 bg-white border-2 border-black shadow-pixel-sm font-vt323 text-lg focus:outline-none focus:shadow-pixel focus:-translate-y-1 transition-all',
        error ? 'border-mario-red' : ''
      ]"
      ref="inputRef"
    />
    <div 
      class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer z-10"
      @click.stop="openPicker"
    >
      <span class="text-xl">📅</span>
    </div>
    <p v-if="error" class="mt-1 font-vt323 text-xs text-mario-red">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  modelValue?: string
  placeholder?: string
  min?: string
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '选择日期和时间',
  min: '',
  error: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const containerRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const openPicker = () => {
  if (inputRef.value) {
    inputRef.value.focus()
    // 优先使用 showPicker()（现代浏览器支持），否则使用 click()
    if (typeof inputRef.value.showPicker === 'function') {
      inputRef.value.showPicker()
    } else {
      inputRef.value.click()
    }
  }
}

// 点击外部关闭（如果需要的话，datetime-local 会自动关闭）
const handleClickOutside = (event: MouseEvent) => {
  // datetime-local 会自动处理，这里不需要额外逻辑
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* 确保 datetime-local input 的样式符合像素风格 */
input[type="datetime-local"] {
  color: #000;
}

input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  opacity: 0;
  position: absolute;
  right: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
</style>

