<script setup>
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
const user = computed(() => userStore.user)

// 社区数据（菌丝）
const communities = ref([
  {
    id: 1,
    name: 'Slashkingdom',
    description: '社区咖啡店',
    memberCount: 1256,
    activityCount: 23,
    image: '/images/eth_logo.png',
    tags: ['商品交换', '公共空间', ],
    status: 'active',
    position: { x: 200, y: 150 },
    color: '#10b981',
    connections: [2, 3] // 连接到其他社区
  },
  {
    id: 2,
    name: '新食纪行动',
    description: '生态资源共建平台',
    memberCount: 892,
    activityCount: 15,
    image: '/images/eth_logo.png',
    tags: ['生态农业', '志愿者', '食物循环'],
    status: 'active',
    position: { x: 600, y: 200 },
    color: '#14b8a6',
    connections: [1, 4]
  },
  {
    id: 3,
    name: 'NFT 艺术社区',
    description: '探索数字艺术与区块链结合的艺术社区',
    memberCount: 634,
    activityCount: 8,
    image: '/images/eth_logo.png',
    tags: ['NFT', '艺术', '创意'],
    status: 'active',
    position: { x: 400, y: 400 },
    color: '#f59e0b',
    connections: [1, 5]
  },
  {
    id: 4,
    name: 'DeFi 创新实验室',
    description: '研究去中心化金融前沿技术的实验室',
    memberCount: 445,
    activityCount: 12,
    image: '/images/eth_logo.png',
    tags: ['DeFi', '金融', '创新'],
    status: 'active',
    position: { x: 800, y: 350 },
    color: '#3b82f6',
    connections: [2, 6]
  },
  {
    id: 5,
    name: 'DAO 治理研究',
    description: '探索去中心化自治组织治理模式的研究社区',
    memberCount: 321,
    activityCount: 6,
    image: '/images/eth_logo.png',
    tags: ['DAO', '治理', '研究'],
    status: 'active',
    position: { x: 300, y: 600 },
    color: '#8b5cf6',
    connections: [3, 6]
  },
  {
    id: 6,
    name: 'Layer2 技术社区',
    description: '专注于Layer2扩容技术的研究与应用',
    memberCount: 567,
    activityCount: 9,
    image: '/images/eth_logo.png',
    tags: ['Layer2', '扩容', '技术'],
    status: 'active',
    position: { x: 700, y: 550 },
    color: '#ef4444',
    connections: [4, 5]
  }
])

// 成员数据（种子）
const members = ref([
  {
    id: 1,
    name: 'Alice',
    avatar: '/images/avatar1.png',
    position: { x: 150, y: 100 },
    contributions: [1, 2],
    color: '#10b981'
  },
  {
    id: 2,
    name: 'Bob',
    avatar: '/images/avatar2.png',
    position: { x: 250, y: 300 },
    contributions: [1, 3],
    color: '#14b8a6'
  },
  {
    id: 3,
    name: 'Carol',
    avatar: '/images/avatar3.png',
    position: { x: 500, y: 150 },
    contributions: [2, 4],
    color: '#f59e0b'
  },
  {
    id: 4,
    name: 'David',
    avatar: '/images/avatar4.png',
    position: { x: 350, y: 500 },
    contributions: [3, 5],
    color: '#3b82f6'
  },
  {
    id: 5,
    name: 'Eve',
    avatar: '/images/avatar5.png',
    position: { x: 750, y: 250 },
    contributions: [4, 6],
    color: '#8b5cf6'
  },
  {
    id: 6,
    name: 'Frank',
    avatar: '/images/avatar6.png',
    position: { x: 650, y: 450 },
    contributions: [5, 6],
    color: '#ef4444'
  }
])

// 动画状态
const animationFrame = ref(0)
const isAnimating = ref(true)

// 检查用户是否已登录
onMounted(async () => {
  await userStore.getUser()
  if (!user.value) {
    await navigateTo('/login')
  }
  startAnimation()
})

// 开始动画
const startAnimation = () => {
  const animate = () => {
    if (isAnimating.value) {
      animationFrame.value++
      requestAnimationFrame(animate)
    }
  }
  animate()
}

// 导航到社区面板
const navigateToDashboard = (communityId) => {
  navigateTo('/dashboard?community=' + communityId)
}

// 导航到成员个人中心
const navigateToMember = (memberId) => {
  navigateTo('/member/' + memberId)
}

// 计算动画位置
const getAnimatedPosition = (basePosition, index) => {
  const time = animationFrame.value * 0.01
  const offset = Math.sin(time + index) * 10
  return {
    x: basePosition.x + offset,
    y: basePosition.y + Math.cos(time + index) * 5
  }
}
</script>

<template>
  <div class="min-h-screen bg-background relative overflow-hidden">
    <!-- 动态背景 -->
    <div class="absolute inset-0 bg-gradient-to-br from-background via-card/20 to-background">
      <div class="absolute inset-0 opacity-30">
        <div 
          v-for="i in 20" 
          :key="i"
          class="absolute w-2 h-2 bg-primary/20 rounded-full animate-pulse"
          :style="{
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            animationDelay: Math.random() * 3 + 's'
          }"
        ></div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="relative z-10">
      
      <!-- 动态网络可视化 -->
      <div class="relative w-full h-[600px] mx-auto max-w-6xl">
        <!-- SVG 画布 -->
        <svg class="w-full h-full" viewBox="0 0 1000 600">
          <!-- 社区间连接线 -->
          <g class="community-connections">
            <template v-for="community in communities" :key="`community-${community.id}`">
              <line
                v-for="connectedId in community.connections"
                :key="`community-connection-${community.id}-${connectedId}`"
                :x1="getAnimatedPosition(community.position, community.id).x"
                :y1="getAnimatedPosition(community.position, community.id).y"
                :x2="getAnimatedPosition(communities.find(c => c.id === connectedId)?.position || {x: 0, y: 0}, connectedId).x"
                :y2="getAnimatedPosition(communities.find(c => c.id === connectedId)?.position || {x: 0, y: 0}, connectedId).y"
                :stroke="community.color"
                stroke-width="3"
                opacity="0.3"
                stroke-dasharray="5,5"
                class="animate-pulse"
              />
            </template>
          </g>
          
          <!-- 成员到社区连接线 -->
          <g class="member-connections">
            <template v-for="member in members" :key="`member-${member.id}`">
              <line
                v-for="communityId in member.contributions"
                :key="`connection-${member.id}-${communityId}`"
                :x1="getAnimatedPosition(member.position, member.id).x"
                :y1="getAnimatedPosition(member.position, member.id).y"
                :x2="getAnimatedPosition(communities.find(c => c.id === communityId)?.position || {x: 0, y: 0}, communityId).x"
                :y2="getAnimatedPosition(communities.find(c => c.id === communityId)?.position || {x: 0, y: 0}, communityId).y"
                :stroke="member.color"
                stroke-width="2"
                opacity="0.8"
                class="animate-pulse"
              />
            </template>
          </g>
          
          <!-- 社区节点（菌丝） -->
          <g class="communities">
            <circle
              v-for="(community, index) in communities"
              :key="`community-${community.id}`"
              :cx="getAnimatedPosition(community.position, index).x"
              :cy="getAnimatedPosition(community.position, index).y"
              :r="Math.max(20, Math.log(community.memberCount) * 5)"
              :fill="community.color"
              :stroke="community.color"
              stroke-width="3"
              opacity="0.8"
              class="cursor-pointer hover:opacity-100 transition-opacity"
              @click="navigateToDashboard(community.id)"
            />
            <text
              v-for="(community, index) in communities"
              :key="`community-text-${community.id}`"
              :x="getAnimatedPosition(community.position, index).x"
              :y="getAnimatedPosition(community.position, index).y + 5"
              text-anchor="middle"
              class="text-xs fill-white font-semibold pointer-events-none"
            >
              {{ community.name }}
            </text>
          </g>
          
          <!-- 成员节点（种子） -->
          <g class="members">
            <circle
              v-for="(member, index) in members"
              :key="`member-${member.id}`"
              :cx="getAnimatedPosition(member.position, index).x"
              :cy="getAnimatedPosition(member.position, index).y"
              :r="12"
              :fill="member.color"
              :stroke="member.color"
              stroke-width="2"
              opacity="0.9"
              class="cursor-pointer hover:opacity-100 transition-opacity"
              @click="navigateToMember(member.id)"
            />
            <text
              v-for="(member, index) in members"
              :key="`member-text-${member.id}`"
              :x="getAnimatedPosition(member.position, index).x"
              :y="getAnimatedPosition(member.position, index).y + 4"
              text-anchor="middle"
              class="text-xs fill-white font-medium pointer-events-none"
            >
              {{ member.name }}
            </text>
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>