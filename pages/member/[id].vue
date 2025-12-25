<template>
  <div class="min-h-screen pb-24">
    <!-- 顶部个人信息区域 -->
    <div class="bg-white border-b-4 border-black p-6 pb-8 relative">
      <div class="flex flex-col items-center gap-4">
        <!-- 编辑按钮 -->
        <div class="absolute top-4 right-4">
          <button
            @click="isEditing = !isEditing"
            class="w-10 h-10 bg-gray-100 border-2 border-black flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <span v-if="!isEditing" class="text-xl">✏️</span>
            <span v-else class="text-xl">❌</span>
          </button>
        </div>

        <!-- 头像与等级 -->
        <div class="relative">
          <div v-if="!isEditing" class="relative">
            <PixelAvatar :src="member?.avatar" :seed="member?.name || 'user'" size="xl" />
            <div class="absolute -bottom-2 -right-2 bg-black text-white text-xs font-pixel px-2 py-1 border-2 border-white">
              LV. {{ memberLevel }}
            </div>
          </div>
          <div v-else class="relative">
            <PixelAvatar :src="editingForm.avatar || member?.avatar" :seed="editingForm.name || member?.name || 'user'" size="xl" />
            <button
              @click="changeAvatar"
              class="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-pixel hover:bg-black/70 transition-colors"
            >
              更换头像
            </button>
          </div>
        </div>

        <!-- 姓名与头衔 -->
        <div class="text-center w-full max-w-xs">
          <div v-if="!isEditing">
            <h1 class="font-pixel text-2xl mb-1">{{ member?.name }}</h1>
            <div class="text-sm text-gray-500 font-vt323 uppercase tracking-wider">{{ member?.title }}</div>
          </div>
          <div v-else class="space-y-3">
            <div>
              <label class="block font-pixel text-xs uppercase mb-1 text-black text-left">名字</label>
              <input
                v-model="editingForm.name"
                type="text"
                class="w-full h-10 px-3 bg-white border-2 border-black shadow-pixel-sm font-vt323 text-base focus:outline-none focus:shadow-pixel focus:-translate-y-1 transition-all"
                placeholder="输入名字"
              />
            </div>
            <div>
              <label class="block font-pixel text-xs uppercase mb-1 text-black text-left">头衔</label>
              <input
                v-model="editingForm.title"
                type="text"
                class="w-full h-10 px-3 bg-white border-2 border-black shadow-pixel-sm font-vt323 text-base focus:outline-none focus:shadow-pixel focus:-translate-y-1 transition-all"
                placeholder="输入头衔"
              />
            </div>
          </div>
        </div>

        <!-- 技能标签 -->
        <div class="w-full max-w-xs">
          <div v-if="!isEditing" class="flex flex-wrap gap-2 justify-center">
            <span 
              v-for="skill in member?.skills" 
              :key="skill" 
              class="bg-gray-100 border border-gray-300 px-3 py-1 text-xs font-pixel rounded-full"
            >
              {{ skill }}
            </span>
          </div>
          <div v-else class="space-y-2">
            <label class="block font-pixel text-xs uppercase mb-1 text-black text-left">技能标签</label>
            <div class="flex flex-wrap gap-2 mb-2">
              <span
                v-for="(skill, index) in editingForm.skills"
                :key="index"
                class="bg-mario-green text-white border-2 border-black px-3 py-1 text-xs font-pixel flex items-center gap-1"
              >
                {{ skill }}
                <button
                  @click="removeSkill(index)"
                  class="hover:text-red-300"
                >
                  ×
                </button>
              </span>
            </div>
            <div class="flex gap-2">
              <input
                v-model="newSkill"
                type="text"
                @keyup.enter="addSkill"
                class="flex-1 h-10 px-3 bg-white border-2 border-black shadow-pixel-sm font-vt323 text-base focus:outline-none focus:shadow-pixel focus:-translate-y-1 transition-all"
                placeholder="输入新标签"
              />
              <PixelButton
                @click="addSkill"
                variant="secondary"
                size="sm"
              >
                添加
              </PixelButton>
            </div>
          </div>
        </div>

        <!-- 编辑模式下的保存/取消按钮 -->
        <div v-if="isEditing" class="flex gap-4 mt-2 w-full max-w-xs">
          <PixelButton block variant="success" @click="saveProfile">保存</PixelButton>
          <PixelButton block variant="secondary" @click="cancelEdit">取消</PixelButton>
        </div>

        <!-- 非编辑模式下的操作按钮 -->
        <div v-else class="flex gap-4 mt-2 w-full max-w-xs">
          <PixelButton block variant="primary" @click="navigateTo('/wallet')">钱包</PixelButton>
          <PixelButton block variant="secondary" @click="navigateTo('/tasks/create')">发布任务</PixelButton>
        </div>
      </div>
    </div>

    <!-- 下方 Tab 区域 -->
    <div class="mt-4 px-4">
      <!-- Tab 导航 -->
      <div class="flex border-b-2 border-black mb-4 overflow-x-auto scrollbar-hide">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-4 py-2 font-pixel text-sm whitespace-nowrap transition-colors',
            activeTab === tab.id ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab 内容 -->
      <div class="min-h-[300px]">
        <!-- HISTORY TAB -->
        <div v-if="activeTab === 'HISTORY'" class="space-y-4">
          <!-- 加载状态 -->
          <div v-if="loadingTasks" class="text-center py-8 text-gray-500 font-vt323">
            加载中...
          </div>
          
          <!-- 任务列表 -->
          <div v-else-if="claimedTasks.length > 0">
            <div v-for="task in claimedTasks" :key="task.id" class="bg-white border-2 border-black p-4 shadow-pixel-sm hover:shadow-pixel transition-shadow cursor-pointer" @click="navigateTo(`/tasks/${task.id}`)">
              <div class="flex items-start gap-3">
                <div class="text-2xl">{{ getTaskIcon(task.status) }}</div>
                <div class="flex-1">
                  <div class="flex justify-between items-start mb-1">
                    <div class="font-bold font-vt323 text-lg leading-tight">{{ task.title }}</div>
                    <div v-if="task.status === 'completed'" class="font-pixel text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                      +{{ task.reward }} ETH
                    </div>
                  </div>
                  <div class="flex items-center gap-2 mb-2">
                    <span :class="getStatusBadgeClass(task.status)">
                      {{ getStatusText(task.status) }}
                    </span>
                    <span v-if="task.status === 'in_progress'" class="font-pixel text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      进行中
                    </span>
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ formatTaskDate(task) }}
                  </div>
                  <div v-if="task.description" class="text-xs text-gray-600 mt-1 line-clamp-2">
                    {{ task.description }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 空状态 -->
          <div v-else class="text-center py-12">
            <div class="text-4xl mb-4">📋</div>
            <div class="font-vt323 text-gray-500">还没有领取任何任务</div>
            <PixelButton 
              variant="primary" 
              size="sm" 
              class="mt-4"
              @click="navigateTo('/tasks')"
            >
              去领取任务
            </PixelButton>
          </div>
        </div>

        <!-- COMMUNITIES TAB -->
        <div v-else-if="activeTab === 'COMMUNITIES'" class="space-y-3">
          <div v-for="comm in communities" :key="comm.id" class="bg-white border-2 border-black p-4 flex items-center gap-4 hover:bg-gray-50 cursor-pointer" @click="navigateTo(`/community/${comm.id}`)">
            <div class="w-12 h-12 bg-mario-red border-2 border-black flex-shrink-0"></div>
            <div class="flex-1">
              <div class="font-pixel text-sm">{{ comm.name }}</div>
              <div class="font-vt323 text-gray-500 text-sm mt-1">积分: {{ comm.points }}</div>
            </div>
            <div class="text-gray-400">›</div>
          </div>
        </div>

        <!-- BADGES TAB -->
        <div v-else-if="activeTab === 'BADGES'" class="grid grid-cols-3 gap-3">
          <div v-for="i in 8" :key="i" class="aspect-square bg-white border-2 border-black flex flex-col items-center justify-center p-2 hover:-translate-y-1 transition-transform">
            <span v-if="i <= 3" class="text-3xl mb-2">🌟</span>
            <span v-else class="text-3xl mb-2 grayscale opacity-30">🔒</span>
            <span class="font-pixel text-[10px] text-center text-gray-600">{{ i <= 3 ? '已解锁' : '未解锁' }}</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFileUpload } from '~/composables/useFileUpload'
import { useApi } from '~/composables/useApi'
import type { Task } from '~/utils/api'
import { useToast } from '~/composables/useToast'

import PixelAvatar from '~/components/pixel/PixelAvatar.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'



definePageMeta({
  layout: 'default'
})

const { getMemberById, getCommunities, getMyTasks } = useApi()

const route = useRoute()
const router = useRouter()
const memberId = parseInt(route.params.id as string)
const activeTab = ref('HISTORY')
const isEditing = ref(false)
const newSkill = ref('')

const tabs = [
  { id: 'HISTORY', label: '动态' },
  { id: 'COMMUNITIES', label: '社区' },
  { id: 'BADGES', label: '徽章' }
]

// 头像
const { uploadFile, previewUrl, uploading, error: uploadError } = useFileUpload()
const { updateUserProfile, getMe } = useApi()
const toast = useToast()
const fileInput = ref<HTMLInputElement | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// Mock Data
const member = ref<any>(null)
const history = ref<any[]>([])
const communities = ref<any[]>([])
const claimedTasks = ref<Task[]>([])
const loadingTasks = ref(false)
let refreshInterval: ReturnType<typeof setInterval> | null = null

// 编辑表单数据
const editingForm = ref({
  name: '',
  title: '',
  skills: [] as string[],
  avatar: ''
})

const memberLevel = computed(() => {
  if (!member.value) return 1
  return Math.floor(member.value.reputation / 100) + 1
})

const navigateTo = (path: string) => {
  router.push(path)
}

// 进入编辑模式
const startEdit = () => {
  if (member.value) {
    editingForm.value = {
      name: member.value.name || '',
      title: member.value.title || '',
      skills: [...(member.value.skills || [])],
      avatar: member.value.avatar || ''
    }
  }
  isEditing.value = true
}

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false
  newSkill.value = ''
}

// 保存资料
const saveProfile = async () => {
  if (!member.value) return
  
  loading.value = true
  error.value = null

  try {
    // 获取当前用户信息
    const user = await getMe()
    if (!user) {
      error.value = '用户信息获取失败，请重新登录'
      loading.value = false
      return
    }

    // 准备要更新的资料
    const profileData: any = {
      name: editingForm.value.name.trim()
    }
    
    // 如果有头像 URL，总是添加到更新数据中
    if (editingForm.value.avatar) {
      profileData.avatar = editingForm.value.avatar
    }

    // 调用 API 更新用户资料
    const result = await updateUserProfile(user.id, profileData)
    
    if (result.success) {
      // 重新获取最新用户信息
      const updatedUser = await getMe()
      if (updatedUser) {
        // 更新本地成员信息
        member.value.name = updatedUser.name || editingForm.value.name
        member.value.avatar = updatedUser.avatar || editingForm.value.avatar || ''
        member.value.title = editingForm.value.title
        member.value.skills = [...editingForm.value.skills]
      } else {
        // 如果获取失败，至少更新本地数据
        member.value.name = editingForm.value.name
        member.value.title = editingForm.value.title
        member.value.skills = [...editingForm.value.skills]
        if (editingForm.value.avatar) {
          member.value.avatar = editingForm.value.avatar
        }
      }
           
      // 更新编辑表单中的头像，确保下次编辑时显示最新头像
      editingForm.value.avatar = member.value.avatar || ''

      // 显示成功提示
      toast.add({
        title: '保存成功',
        description: '个人信息已更新',
        color: 'green'
      })
      
      isEditing.value = false
      newSkill.value = ''
    } else {
      throw new Error(result.message || '保存失败')
    }
  } catch (err: any) {
    console.error('保存失败:', err)
    error.value = err.message || '保存失败，请稍后重试'
    toast.add({
      title: '保存失败',
      description: err.message || '请稍后重试',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

// 添加技能标签
const addSkill = () => {
  if (newSkill.value.trim() && !editingForm.value.skills.includes(newSkill.value.trim())) {
    editingForm.value.skills.push(newSkill.value.trim())
    newSkill.value = ''
  }
}

// 移除技能标签
const removeSkill = (index: number) => {
  editingForm.value.skills.splice(index, 1)
}

// 更换头像
const changeAvatar = () => {
  // 创建隐藏的文件输入
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = async (e: Event) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return 

    // 上传头像
    const url = await uploadFile(file)
    if (url) {
      editingForm.value.avatar = url 
      toast.add({
        title: '头像上传成功',
        description: '保存后生效',
        color: 'green'
      })
    }
  }
  input.click()
}

// 监听编辑按钮点击
watch(() => isEditing.value, (newVal) => {
  if (newVal) {
    startEdit()
  } else {
    cancelEdit()
  }
})

// 加载领取的任务列表
const loadClaimedTasks = async () => {
  loadingTasks.value = true
  try {
    const tasks = await getMyTasks()
    // 按更新时间倒序排列，最新的在前
    claimedTasks.value = tasks.sort((a, b) => {
      const timeA = new Date(b.updatedAt || b.claimedAt || b.createdAt).getTime()
      const timeB = new Date(a.updatedAt || a.claimedAt || a.createdAt).getTime()
      return timeA - timeB
    })
  } catch (error) {
    console.error('Failed to load claimed tasks:', error)
  } finally {
    loadingTasks.value = false
  }
}

// 获取任务状态文本
const getStatusText = (status: Task['status']): string => {
  const statusMap: Record<string, string> = {
    'unclaimed': '未领取',
    'in_progress': '进行中',
    'under_review': '审核中',
    'completed': '已完成',
    'rejected': '已驳回'
  }
  return statusMap[status] || '未知'
}

// 获取任务状态图标
const getTaskIcon = (status: Task['status']): string => {
  const iconMap: Record<string, string> = {
    'unclaimed': '📋',
    'in_progress': '🔄',
    'under_review': '⏳',
    'completed': '✅',
    'rejected': '❌'
  }
  return iconMap[status] || '📋'
}

// 获取状态徽章样式
const getStatusBadgeClass = (status: Task['status']): string => {
  const classMap: Record<string, string> = {
    'unclaimed': 'font-pixel text-[10px] px-2 py-0.5 rounded border border-yellow-600 text-yellow-600 bg-yellow-50',
    'in_progress': 'font-pixel text-[10px] px-2 py-0.5 rounded border border-blue-600 text-blue-600 bg-blue-50',
    'under_review': 'font-pixel text-[10px] px-2 py-0.5 rounded border border-orange-600 text-orange-600 bg-orange-50',
    'completed': 'font-pixel text-[10px] px-2 py-0.5 rounded border border-green-600 text-green-600 bg-green-50',
    'rejected': 'font-pixel text-[10px] px-2 py-0.5 rounded border border-red-600 text-red-600 bg-red-50'
  }
  return classMap[status] || 'font-pixel text-[10px] px-2 py-0.5 rounded border border-gray-600 text-gray-600 bg-gray-50'
}

// 格式化任务日期
const formatTaskDate = (task: Task): string => {
  let dateStr = ''
  let action = ''
  
  if (task.completedAt) {
    dateStr = task.completedAt
    action = '完成于'
  } else if (task.submittedAt) {
    dateStr = task.submittedAt
    action = '提交于'
  } else if (task.claimedAt) {
    dateStr = task.claimedAt
    action = '领取于'
  } else {
    dateStr = task.createdAt
    action = '创建于'
  }
  
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor(diff / (1000 * 60))
  
  let timeStr = ''
  if (days > 0) {
    timeStr = `${days}天前`
  } else if (hours > 0) {
    timeStr = `${hours}小时前`
  } else if (minutes > 0) {
    timeStr = `${minutes}分钟前`
  } else {
    timeStr = '刚刚'
  }
  
  return `${action} ${timeStr}`
}

// 监听 activeTab，当切换到动态tab时刷新任务列表
watch(() => activeTab.value, (newTab) => {
  if (newTab === 'HISTORY') {
    loadClaimedTasks()
  }
})

onMounted(async () => {
  // 从 API 获取成员数据
  try {
    member.value = await getMemberById(memberId)
    
    if (member.value) {
      // 获取成员所属的社群信息
      const allCommunities = await getCommunities()
      communities.value = allCommunities
        .filter(c => member.value.communities.includes(c.id))
        .map(c => ({
          id: c.id,
          name: c.name,
          points: member.value.reputation // 使用成员的声誉值作为在该社群的积分
        }))
      
      // 生成历史记录（基于成员的贡献）
      history.value = [
        { 
          id: 1, 
          title: `完成了 ${member.value.completedTasks} 个任务`, 
          date: '最近', 
          community: communities.value[0]?.name || '社群', 
          points: member.value.totalReward * 100, 
          icon: '✅' 
        },
        { 
          id: 2, 
          title: `贡献了 ${member.value.totalContributions} 次`, 
          date: '最近', 
          community: communities.value[0]?.name || '社群', 
          points: member.value.totalContributions * 10, 
          icon: '🌟' 
        },
      ]
      
      // 如果当前是动态tab，加载任务列表
      if (activeTab.value === 'HISTORY') {
        loadClaimedTasks()
      }
      
      // 设置定时刷新任务列表（每30秒刷新一次）
      refreshInterval = setInterval(() => {
        if (activeTab.value === 'HISTORY') {
          loadClaimedTasks()
        }
      }, 30000)
    }
  } catch (error) {
    console.error('Failed to load member data:', error)
  }
})

// 组件卸载时清除定时器
onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
    refreshInterval = null
  }
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
