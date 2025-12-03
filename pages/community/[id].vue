<template>
  <div class="space-y-8">
    <!-- Village Header -->
    <div class="relative h-48 md:h-64 w-full bg-mario-sky overflow-hidden border-4 border-black shadow-pixel">
      <!-- Parallax Background Layers (Simulated) -->
      <div class="absolute bottom-0 w-full h-16 bg-mario-ground"></div>
      <div class="absolute bottom-16 left-10 w-20 h-20 bg-red-500 pixel-house"></div>
      <div class="absolute bottom-16 right-20 w-24 h-24 bg-blue-500 pixel-castle"></div>
      <div class="absolute top-4 left-1/2 -translate-x-1/2 font-pixel text-white text-shadow-pixel text-2xl md:text-4xl uppercase text-center">
        {{ community?.name || '正在加载村庄...' }}
      </div>
      
      <!-- Stats Bar -->
      <div class="absolute top-0 left-0 bg-black/50 p-2 text-white font-pixel text-xs flex gap-4">
        <span>人口: {{ community?.memberCount || 0 }}</span>
        <span>等级: {{ Math.floor((community?.activityCount || 0) / 10) + 1 }}</span>
      </div>
    </div>

    <!-- Village Content Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      <!-- Left Col: Main Content (Tabs) -->
      <div class="md:col-span-2 space-y-6">
        
        <!-- Tab Navigation -->
        <div class="flex border-b-4 border-black">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-4 py-2 font-pixel text-sm transition-all border-t-4 border-x-4 border-black -mb-1 mr-2',
              activeTab === tab.id ? 'bg-mario-red text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- QUESTS TAB -->
        <div v-if="activeTab === 'QUESTS'" class="space-y-6">
          <div class="flex items-center justify-between bg-white border-2 border-black p-2">
            <div class="font-pixel text-sm">当前任务: {{ tasks.length }}</div>
            <PixelButton size="sm" variant="primary">发布新任务</PixelButton>
          </div>

          <div class="grid gap-4">
            <PixelCard v-for="task in tasks" :key="task.id" hover>
              <template #header>
                <div class="flex justify-between items-start">
                  <span :class="task.type === 'OFFER' ? 'text-blue-600' : 'text-red-600'">
                    [{{ task.type === 'OFFER' ? '提供' : '需求' }}]
                  </span>
                  <span class="text-xs text-gray-400">{{ task.timeAgo }}</span>
                </div>
              </template>
              
              <div class="flex gap-4">
                <PixelAvatar :seed="task.author" size="md" />
                <div>
                  <h3 class="font-bold text-lg">{{ task.title }}</h3>
                  <p class="text-gray-600 text-sm">{{ task.description }}</p>
                </div>
              </div>

              <template #footer>
                <div class="flex items-center gap-2">
                  <div class="text-mario-coin font-bold flex items-center gap-1">
                    <div class="w-3 h-3 bg-mario-coin rounded-sm"></div>
                    {{ task.reward }}
                  </div>
                  <span class="text-xs bg-gray-200 px-2 py-1 font-pixel uppercase">{{ task.statusLabel }}</span>
                </div>
                <PixelButton size="sm" variant="secondary">接受任务</PixelButton>
              </template>
            </PixelCard>
          </div>
        </div>

        <!-- EVENTS TAB -->
        <div v-else-if="activeTab === 'EVENTS'" class="space-y-4">
           <PixelCard v-for="event in events" :key="event.id">
             <div class="flex gap-4">
               <div class="w-20 h-20 bg-black/10 flex items-center justify-center text-4xl border-2 border-black">
                 📅
               </div>
               <div class="flex-1">
                 <div class="font-pixel text-xs text-mario-red mb-1">{{ event.date }}</div>
                 <h3 class="font-bold text-xl font-vt323">{{ event.title }}</h3>
                 <p class="text-sm text-gray-600 mt-1">{{ event.description }}</p>
                 <div class="mt-2 flex gap-2">
                   <span class="text-xs bg-green-100 text-green-800 px-2 py-0.5 border border-green-600">
                     {{ event.participants }} 人已报名
                   </span>
                 </div>
               </div>
               <div class="flex flex-col justify-center">
                 <PixelButton size="sm" variant="success">报名参加</PixelButton>
               </div>
             </div>
           </PixelCard>
        </div>

        <!-- INTRO TAB -->
        <div v-else-if="activeTab === 'INTRO'">
          <PixelCard>
            <div class="prose font-vt323 text-lg max-w-none p-4">
              <h3 class="font-pixel text-sm uppercase border-b-2 border-black pb-2 mb-4">欢迎来到 {{ community?.name }}</h3>
              <div class="whitespace-pre-wrap">{{ community?.markdownIntro }}</div>
            </div>
          </PixelCard>
        </div>

      </div>

      <!-- Right Col: Town Hall (Governance & Members) -->
      <div class="space-y-6">
        <PixelCard>
          <template #header>市政厅 (TOWN HALL)</template>
          <div class="space-y-4 text-center">
            <div class="w-full h-24 bg-gray-100 flex items-center justify-center border-2 border-dashed border-black/20 relative overflow-hidden">
              <!-- Castle IMG Placeholder -->
              <div class="absolute inset-0 flex items-center justify-center text-6xl opacity-20">🏰</div>
            </div>
            
            <!-- Community Stats -->
            <div class="grid grid-cols-2 gap-2 text-left font-vt323 text-lg bg-gray-50 p-2 border border-black/10">
               <div>总积分:</div>
               <div class="text-right text-mario-coin font-bold">{{ community?.totalPoints || 0 }}</div>
               <div>成员:</div>
               <div class="text-right font-bold">{{ community?.memberCount || 0 }}</div>
            </div>

            <p class="text-sm text-gray-600 text-left">
              {{ community?.description || '菌丝网络中的一个和平村庄。' }}
            </p>
            <PixelButton block variant="success">加入村庄</PixelButton>
          </div>
        </PixelCard>

        <PixelCard>
          <template #header>村民 (VILLAGERS)</template>
          <div class="grid grid-cols-4 gap-2">
             <PixelAvatar 
               v-for="member in members.slice(0, 12)" 
               :key="member.id" 
               :seed="member.avatarSeed || member.name" 
               size="sm"
               class="cursor-pointer hover:scale-110 transition-transform"
               @click="navigateTo('/member/' + member.id)"
             />
          </div>
          <div v-if="members.length > 12" class="text-xs text-gray-500 mt-2 text-center">
            还有 {{ members.length - 12 }} 位成员...
          </div>
        </PixelCard>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PixelButton from '~/components/pixel/PixelButton.vue'
import PixelCard from '~/components/pixel/PixelCard.vue'
import PixelAvatar from '~/components/pixel/PixelAvatar.vue'
import { getCommunityById, getCommunityMembers } from '~/utils/api'

const route = useRoute()
const router = useRouter()
const communityId = parseInt(route.params.id as string)
const activeTab = ref('QUESTS')

const tabs = [
  { id: 'QUESTS', label: '任务看板' },
  { id: 'EVENTS', label: '社区活动' },
  { id: 'INTRO', label: '简介' }
]

// Data
const community = ref<any>(null)
const members = ref<any[]>([])
const tasks = ref<any[]>([])
const events = ref<any[]>([])

const navigateTo = (path: string) => {
  router.push(path)
}

onMounted(async () => {
  // 从 API 获取社群数据
  try {
    community.value = await getCommunityById(communityId)
    if (community.value) {
      members.value = await getCommunityMembers(communityId)
    }
  } catch (error) {
    console.error('Failed to load community data:', error)
  }
  
  // Mock tasks and events (可以后续从 API 获取)
  setTimeout(() => {

    tasks.value = [
      {
        id: 1,
        type: 'NEED',
        title: '修理水管',
        description: '厨房水管漏得到处都是！急需专业人士。',
        reward: 50,
        author: 'Peach',
        timeAgo: '2小时前',
        status: 'OPEN',
        statusLabel: '开放中'
      },
      {
        id: 2,
        type: 'OFFER',
        title: '免费卡丁车接送',
        description: '这周末我可以送任何人去市中心。',
        reward: 0,
        author: 'Toad',
        timeAgo: '5小时前',
        status: 'OPEN',
        statusLabel: '开放中'
      },
      {
        id: 3,
        type: 'NEED',
        title: '打败库巴',
        description: '他又回来了。非诚勿扰。',
        reward: 9999,
        author: 'Mario',
        timeAgo: '1天前',
        status: 'BOSS LEVEL',
        statusLabel: 'BOSS战'
      }
    ]

    events.value = [
       { id: 1, title: '每周管道检查', date: '2024-11-30', description: '检查所有绿色管道是否有食人花。', participants: 12 },
       { id: 2, title: '卡丁车锦标赛', date: '2024-12-05', description: '彩虹之路聚会。自带香蕉皮。', participants: 64 }
    ]
  }, 500)
})
</script>

<style scoped>
.pixel-house {
  clip-path: polygon(
    20% 40%, 80% 40%, 80% 100%, 20% 100%, 20% 40%,
    0% 40%, 50% 0%, 100% 40%, 80% 40%
  );
}
.pixel-castle {
  clip-path: polygon(
    0% 100%, 0% 30%, 20% 30%, 20% 0%, 40% 0%, 40% 30%, 
    60% 30%, 60% 0%, 80% 0%, 80% 30%, 100% 30%, 100% 100%
  );
}
</style>
