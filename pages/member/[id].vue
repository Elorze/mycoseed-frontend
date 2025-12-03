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
            <PixelAvatar :seed="member?.name || 'user'" size="xl" />
            <div class="absolute -bottom-2 -right-2 bg-black text-white text-xs font-pixel px-2 py-1 border-2 border-white">
              LV. {{ memberLevel }}
            </div>
          </div>
          <div v-else class="relative">
            <PixelAvatar :seed="editingForm.name || 'user'" size="xl" />
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
          <div v-for="action in history" :key="action.id" class="bg-white border-2 border-black p-4 shadow-pixel-sm">
            <div class="flex items-start gap-3">
              <div class="text-2xl">{{ action.icon }}</div>
              <div class="flex-1">
                <div class="flex justify-between items-start">
                  <div class="font-bold font-vt323 text-lg leading-tight">{{ action.title }}</div>
                  <div class="font-pixel text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">+{{ action.points }} CP</div>
                </div>
                <div class="text-xs text-gray-500 mt-1">{{ action.date }} • {{ action.community }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- COMMUNITIES TAB -->
        <div v-else-if="activeTab === 'COMMUNITIES'" class="space-y-3">
          <div v-for="comm in communities" :key="comm.id" class="bg-white border-2 border-black p-4 flex items-center gap-4 hover:bg-gray-50 cursor-pointer" @click="navigateTo('/community/' + comm.id)">
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

        <!-- TASKS TAB -->
        <div v-else-if="activeTab === 'TASKS'" class="space-y-3">
          <div v-for="task in memberTasks" :key="task.id" class="bg-white border-2 border-black p-4">
            <div class="flex justify-between items-center mb-2">
              <span :class="['font-pixel text-[10px] px-2 py-0.5 rounded border border-current', task.type === 'OFFER' ? 'text-blue-600 bg-blue-50' : 'text-red-600 bg-red-50']">
                {{ task.type === 'OFFER' ? '提供' : '需求' }}
              </span>
              <span class="font-vt323 text-xs text-gray-500">{{ task.statusLabel }}</span>
            </div>
            <div class="font-bold text-base">{{ task.title }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PixelAvatar from '~/components/pixel/PixelAvatar.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'
import { getMemberById, getCommunities } from '~/utils/api'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const memberId = parseInt(route.params.id as string)
const activeTab = ref('HISTORY')
const isEditing = ref(false)
const newSkill = ref('')

const tabs = [
  { id: 'HISTORY', label: '动态' },
  { id: 'COMMUNITIES', label: '社区' },
  { id: 'BADGES', label: '徽章' },
  { id: 'TASKS', label: '任务' }
]

// Mock Data
const member = ref<any>(null)
const history = ref<any[]>([])
const communities = ref<any[]>([])
const memberTasks = ref<any[]>([])

// 编辑表单数据
const editingForm = ref({
  name: '',
  title: '',
  skills: [] as string[],
  avatarSeed: ''
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
      avatarSeed: member.value.name || 'user'
    }
  }
  isEditing.value = true
}

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false
  newSkill.value = ''
}

// 保存编辑
const saveProfile = () => {
  if (!member.value) return
  
  // 更新成员信息
  member.value.name = editingForm.value.name
  member.value.title = editingForm.value.title
  member.value.skills = [...editingForm.value.skills]
  
  // 显示成功提示
  const toast = useToast()
  toast.add({
    title: '保存成功',
    description: '个人信息已更新',
    color: 'green'
  })
  
  isEditing.value = false
  newSkill.value = ''
  
  // TODO: 这里应该调用 API 保存到服务器
  // await updateMemberProfile(memberId, editingForm.value)
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
  // 由于 PixelAvatar 是基于 seed 生成的，我们可以通过改变 seed 来改变头像
  // 这里可以弹出一个头像选择器，或者让用户输入一个 seed 字符串
  const newSeed = prompt('输入头像种子（可以是任意文字）:', editingForm.value.avatarSeed || editingForm.value.name)
  if (newSeed) {
    editingForm.value.avatarSeed = newSeed
    // 更新 member 的 name 也会更新头像（因为 PixelAvatar 使用 name 作为 seed）
    editingForm.value.name = newSeed
  }
}

// 监听编辑按钮点击
watch(() => isEditing.value, (newVal) => {
  if (newVal) {
    startEdit()
  } else {
    cancelEdit()
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
      
      // 生成任务列表（可以后续从 API 获取）
      memberTasks.value = [
        { id: 1, type: 'OFFER', title: '提供帮助', status: 'COMPLETED', statusLabel: '已完成' },
        { id: 2, type: 'NEED', title: '寻求协助', status: 'IN_PROGRESS', statusLabel: '进行中' },
      ]
    }
  } catch (error) {
    console.error('Failed to load member data:', error)
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
