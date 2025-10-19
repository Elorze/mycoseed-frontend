<template>
  <div 
    class="activity-card group cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white border border-gray-100 hover:border-blue-200 block"
    @click.stop="handleClick"
  >
    <!-- 活动封面图 -->
    <div class="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
      <img 
        v-if="activity.image" 
        :src="activity.image" 
        :alt="activity.name"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
      />
      
      <!-- 状态标签 -->
      <div class="absolute top-3 right-3">
        <span 
          class="px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
          :class="statusClass"
        >
          {{ statusText }}
        </span>
      </div>
    </div>

    <!-- 活动内容 -->
    <div class="p-4">
      <!-- 活动标题 -->
      <h3 class="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
        {{ activity.name }}
      </h3>

      <!-- 活动描述 -->
      <p class="text-sm text-gray-600 mb-4 line-clamp-2">
        {{ activity.description }}
      </p>

      <!-- 活动信息 -->
      <div class="space-y-2 mb-4">
        <!-- 时间 -->
        <div class="flex items-center gap-2 text-sm text-gray-700">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ formatTimeRange }}</span>
        </div>

        <!-- 地点 -->
        <div class="flex items-center gap-2 text-sm text-gray-700">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span class="line-clamp-1">{{ activity.location }}</span>
        </div>

        <!-- 主办方 -->
        <div class="flex items-center gap-2 text-sm text-gray-700">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span class="line-clamp-1">{{ activity.organizer }}</span>
        </div>
      </div>

      <!-- 底部信息：参与人数 & 标签 -->
      <div class="flex items-center justify-between pt-3 border-t border-gray-100">
        <!-- 参与人数 -->
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span class="text-sm font-medium text-gray-700">
            {{ activity.participants }}/{{ activity.maxParticipants }}
          </span>
          <span 
            v-if="isFull" 
            class="text-xs text-red-500 font-semibold"
          >
            已满
          </span>
        </div>

        <!-- 第一个标签 -->
        <div v-if="activity.tags.length > 0" class="flex gap-1">
          <span class="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-md font-medium">
            {{ activity.tags[0] }}
          </span>
          <span v-if="activity.tags.length > 1" class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
            +{{ activity.tags.length - 1 }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Activity } from '~/utils/api'

// Props
interface Props {
  activity: Activity
}

const props = defineProps<Props>()
const router = useRouter()

// 点击处理
const handleClick = () => {
  router.push(`/activities/${props.activity.id}`)
}

// 计算属性：状态样式
const statusClass = computed(() => {
  switch (props.activity.status) {
    case 'upcoming':
      return 'bg-blue-500/90 text-white'
    case 'ongoing':
      return 'bg-green-500/90 text-white'
    case 'ended':
      return 'bg-gray-500/90 text-white'
    default:
      return 'bg-gray-500/90 text-white'
  }
})

// 计算属性：状态文本
const statusText = computed(() => {
  switch (props.activity.status) {
    case 'upcoming':
      return '即将开始'
    case 'ongoing':
      return '进行中'
    case 'ended':
      return '已结束'
    default:
      return '未知'
  }
})

// 计算属性：格式化时间范围
const formatTimeRange = computed(() => {
  const start = new Date(props.activity.startTime)
  const end = new Date(props.activity.endTime)
  
  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${month}月${day}日 ${hours}:${minutes}`
  }
  
  // 如果是同一天
  if (start.toDateString() === end.toDateString()) {
    const startTime = `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}`
    const endTime = `${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`
    return `${formatDate(start).split(' ')[0]} ${startTime}-${endTime}`
  }
  
  return `${formatDate(start)} - ${formatDate(end)}`
})

// 计算属性：是否已满
const isFull = computed(() => {
  return props.activity.participants >= props.activity.maxParticipants
})
</script>

<style scoped>
/* 文本截断 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>