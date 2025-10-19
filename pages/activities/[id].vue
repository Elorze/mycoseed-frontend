<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- 返回按钮 -->
      <button
        @click="() => navigateTo('/activities')"
        class="mb-6 flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors group cursor-pointer"
      >
        <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span class="font-medium">返回活动列表</span>
      </button>

      <!-- 活动详情卡片 -->
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <!-- 活动标题 -->
        <h1 class="text-4xl font-bold text-gray-900 mb-6">{{ activity.name }}</h1>
        
        <!-- 活动介绍 -->
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">活动介绍</h2>
          <p class="text-gray-700 leading-relaxed text-lg">{{ activity.description }}</p>
        </div>
      </div>

      <!-- 任务列表 -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">活动任务</h2>
        
        <div v-if="tasks.length === 0" class="text-center py-8 text-gray-500">
          暂无任务
        </div>
        
        <div v-else class="space-y-4">
          <div
            v-for="task in tasks"
            :key="task.id"
            class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-lg font-semibold text-gray-900">{{ task.title }}</h3>
                  <span class="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                    {{ task.reward }} ETH
                  </span>
                </div>
                <p class="text-gray-600">{{ task.description }}</p>
              </div>
              <button
                v-if="!task.isClaimed"
                @click="handleClaimTask(task.id)"
                class="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
              >
                领取任务
              </button>
              <span v-else class="ml-4 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg whitespace-nowrap">
                已领取
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getActivityById, getTasks, claimTask, type Activity, type Task } from '~/utils/api'

const route = useRoute()

// 响应式数据
const activity = ref<Activity>({
  id: 0,
  name: '',
  location: '',
  startTime: '',
  endTime: '',
  description: '',
  image: '',
  organizer: '',
  participants: 0,
  maxParticipants: 0,
  status: 'upcoming',
  tags: []
})

const tasks = ref<Task[]>([])

// 获取路由参数
const activityId = computed(() => parseInt(route.params.id as string) || 0)

// 领取任务
const handleClaimTask = async (taskId: number) => {
  const result = await claimTask(taskId)
  if (result.success) {
    // 重新加载任务列表
    tasks.value = await getTasks(activityId.value)
    alert(result.message)
  } else {
    alert(result.message)
  }
}

// 加载活动和任务
onMounted(async () => {
  const activityResult = await getActivityById(activityId.value)
  if (activityResult) activity.value = activityResult
  
  tasks.value = await getTasks(activityId.value)
})
</script>
