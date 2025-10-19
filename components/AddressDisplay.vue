<template>
  <div class="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 cursor-pointer hover:bg-gray-200 transition-colors" @click="copyAddress">
    <div class="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
      {{ address.slice(2, 4).toUpperCase() }}
    </div>
    <span class="font-medium">{{ formatAddress(address) }}</span>
    <span class="text-xs">📋</span>
  </div>
</template>

<script setup>
const props = defineProps({
  address: String
})

const formatAddress = (address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const copyAddress = async () => {
  try {
    await navigator.clipboard.writeText(props.address)
    console.log('地址已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
  }
}
</script>