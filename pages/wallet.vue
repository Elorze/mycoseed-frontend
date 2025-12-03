<template>
  <div class="max-w-4xl mx-auto w-full space-y-8">
    
    <!-- Wallet Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <!-- Chain Switch Button -->
        <button 
          @click="showChainSelector = true"
          class="w-10 h-10 bg-mario-red border-2 border-black flex items-center justify-center text-white font-pixel text-sm shadow-pixel hover:scale-105 transition-transform"
        >
          {{ currentChain.shortName }}
        </button>
        
        <!-- Address Display -->
        <div class="flex items-center gap-2 px-3 py-1.5 bg-gray-100 border-2 border-black shadow-pixel-sm">
          <PixelAvatar :seed="walletAddress" size="sm" />
          <span class="font-vt323 text-lg">{{ truncatedAddress }}</span>
          <button 
            @click="copyAddress"
            class="text-gray-400 hover:text-black transition-colors cursor-pointer"
            title="复制地址"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Right Actions -->
      <div class="flex items-center gap-3">
        <button 
          class="w-8 h-8 flex items-center justify-center hover:bg-gray-100 border-2 border-black transition-colors"
          title="交易记录"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
        <button 
          class="w-8 h-8 flex items-center justify-center hover:bg-gray-100 border-2 border-black transition-colors"
          title="设置"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Chain Selector Modal -->
    <div v-if="showChainSelector" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div class="w-full max-w-sm">
        <PixelCard>
          <template #header>
            <div class="flex justify-between items-center">
              <span>选择网络</span>
              <button @click="showChainSelector = false" class="hover:text-red-500">✕</button>
            </div>
          </template>
          
          <div class="space-y-2 py-4">
            <div 
              v-for="chain in availableChains" 
              :key="chain.id"
              @click="selectChain(chain)"
              :class="[
                'flex items-center justify-between p-3 border-2 cursor-pointer transition-all',
                currentChain.id === chain.id ? 'border-black bg-gray-100' : 'border-black/10 hover:bg-gray-50 hover:border-black'
              ]"
            >
              <div class="flex items-center gap-3">
                <div 
                  :class="[
                    'w-8 h-8 border-2 border-black flex items-center justify-center text-white font-pixel text-xs shadow-pixel-sm',
                    currentChain.id === chain.id ? 'bg-mario-red' : 'bg-gray-400'
                  ]"
                >
                  {{ chain.shortName }}
                </div>
                <div>
                  <div class="font-pixel text-xs">{{ chain.name }}</div>
                  <div class="font-vt323 text-xs text-gray-500">{{ chain.nativeCurrency.symbol }}</div>
                </div>
              </div>
              <div v-if="currentChain.id === chain.id" class="text-green-600 font-pixel text-xs">
                ✓
              </div>
            </div>
          </div>

          <template #footer>
            <PixelButton block variant="secondary" @click="showChainSelector = false">关闭</PixelButton>
          </template>
        </PixelCard>
      </div>
    </div>

    <!-- Actions Bar -->
    <div class="grid grid-cols-2 gap-4">
      <PixelButton variant="primary" size="lg" @click="showSendModal = true">
        <div class="flex flex-col items-center gap-1 py-2">
          <span class="text-xl">📤</span>
          <span>转账</span>
        </div>
      </PixelButton>
      <PixelButton variant="secondary" size="lg" @click="showReceiveModal = true">
        <div class="flex flex-col items-center gap-1 py-2">
          <span class="text-xl">📥</span>
          <span>收款</span>
        </div>
      </PixelButton>
    </div>

    <!-- Community Points -->
    <PixelCard hover>
      <template #header>社区积分 (POINTS)</template>
      <div class="space-y-4">
        <!-- MYCO COIN -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-mario-coin border-2 border-black flex items-center justify-center text-2xl shadow-pixel">
              🪙
            </div>
            <div>
              <div class="font-pixel text-xs text-mario-coin">MYCO COIN</div>
              <div class="font-vt323 text-4xl">8,430 CP</div>
            </div>
          </div>
          <div class="text-right">
            <div class="font-pixel text-[10px] text-green-600 bg-green-100 px-2 py-1 border border-green-600">
              +120 本周新增
            </div>
          </div>
        </div>
        
        <!-- Zero Waste Points -->
        <div class="border-t-2 border-dashed border-black/20 pt-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-green-200 border-2 border-black flex items-center justify-center text-2xl shadow-pixel">
                ♻️
              </div>
              <div>
                <div class="font-pixel text-xs text-green-600">零废弃积分</div>
                <div class="font-vt323 text-4xl">2,150 ZWP</div>
              </div>
            </div>
            <div class="text-right">
              <div class="font-pixel text-[10px] text-green-600 bg-green-100 px-2 py-1 border border-green-600">
                +50 本周新增
              </div>
            </div>
          </div>
        </div>
      </div>
    </PixelCard>

    <!-- History & Records -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- Transaction History -->
      <div class="md:col-span-2">
        <PixelCard>
          <template #header>交易记录</template>
          <div class="space-y-3">
            <div v-for="tx in transactions" :key="tx.id" class="flex items-center justify-between p-2 border-b-2 border-dashed border-black/10 hover:bg-gray-50 transition-colors">
              <div class="flex items-center gap-3">
                <div :class="['w-8 h-8 border-2 border-black flex items-center justify-center text-sm shadow-pixel-sm', tx.type === 'in' ? 'bg-green-100' : 'bg-red-100']">
                  {{ tx.type === 'in' ? '⬇️' : '⬆️' }}
                </div>
                <div>
                  <div class="font-pixel text-[10px] uppercase">{{ tx.title }}</div>
                  <div class="font-vt323 text-gray-500 text-sm">{{ tx.date }}</div>
                </div>
              </div>
              <div :class="['font-vt323 text-xl', tx.type === 'in' ? 'text-green-600' : 'text-red-600']">
                {{ tx.type === 'in' ? '+' : '-' }}{{ tx.amount }} {{ tx.currency }}
              </div>
            </div>
          </div>
          <template #footer>
            <PixelButton size="sm" variant="ghost" block>查看链上记录 ↗</PixelButton>
          </template>
        </PixelCard>
      </div>

      <!-- NFT Badges Preview -->
      <div class="md:col-span-1">
        <PixelCard>
          <template #header>徽章背包</template>
          <div class="grid grid-cols-2 gap-2">
            <div v-for="badge in badges" :key="badge.id" class="aspect-square bg-black/5 border-2 border-black flex items-center justify-center text-3xl hover:scale-105 transition-transform cursor-pointer bg-white" :title="badge.name">
              {{ badge.icon }}
            </div>
            <div class="aspect-square border-2 border-dashed border-black/30 flex items-center justify-center text-gray-400 cursor-pointer hover:bg-black/5">
              +
            </div>
          </div>
        </PixelCard>
      </div>
    </div>

    <!-- Send Modal -->
    <div v-if="showSendModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div class="w-full max-w-md">
        <PixelCard>
          <template #header>
            <div class="flex justify-between items-center">
              <span>发送资产</span>
              <button @click="closeSendModal" class="hover:text-red-500">✕</button>
            </div>
          </template>
          
          <div class="space-y-4 py-4">
            <div>
              <label class="block font-pixel text-xs mb-2">接收方 (地址 / 手机号)</label>
              <div class="flex gap-2">
                <input 
                  v-model="sendForm.recipient" 
                  type="text" 
                  placeholder="0x... or 138..." 
                  class="flex-1 p-3 font-vt323 text-xl border-2 border-black shadow-pixel-sm focus:outline-none focus:translate-y-1 focus:shadow-none transition-all"
                >
                <button 
                  @click="openScanner" 
                  class="px-4 py-3 bg-white border-2 border-black shadow-pixel-sm hover:bg-gray-100 transition-colors font-pixel text-xs"
                  title="扫描二维码"
                >
                  📷
                </button>
                <button 
                  @click="showContacts = true" 
                  class="px-4 py-3 bg-white border-2 border-black shadow-pixel-sm hover:bg-gray-100 transition-colors font-pixel text-xs"
                  title="通讯录"
                >
                  📇
                </button>
              </div>
            </div>
            <div>
              <label class="block font-pixel text-xs mb-2">金额</label>
              <input 
                v-model="sendForm.amount" 
                type="number" 
                step="0.000001"
                placeholder="0.00" 
                class="w-full p-3 font-vt323 text-xl border-2 border-black shadow-pixel-sm focus:outline-none focus:translate-y-1 focus:shadow-none transition-all"
              >
            </div>
            <div>
              <label class="block font-pixel text-xs mb-2">备注信息</label>
              <input 
                v-model="sendForm.note" 
                type="text" 
                placeholder="可选，添加备注信息..." 
                class="w-full p-3 font-vt323 text-lg border-2 border-black shadow-pixel-sm focus:outline-none focus:translate-y-1 focus:shadow-none transition-all"
              >
            </div>
          </div>

          <template #footer>
            <div class="flex gap-4 w-full">
              <PixelButton block variant="secondary" @click="closeSendModal">取消</PixelButton>
              <PixelButton block variant="success" @click="handleSend">确认发送</PixelButton>
            </div>
          </template>
        </PixelCard>
      </div>
    </div>

    <!-- Contacts Modal -->
    <div v-if="showContacts" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div class="w-full max-w-md">
        <PixelCard>
          <template #header>
            <div class="flex justify-between items-center">
              <span>通讯录</span>
              <button @click="showContacts = false" class="hover:text-red-500">✕</button>
            </div>
          </template>
          
          <div class="space-y-2 py-4 max-h-96 overflow-y-auto">
            <div 
              v-for="contact in savedContacts" 
              :key="contact.id"
              @click="selectContact(contact)"
              class="flex items-center justify-between p-3 border-2 border-black/10 hover:bg-gray-50 hover:border-black cursor-pointer transition-all"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gray-200 border-2 border-black flex items-center justify-center text-lg shadow-pixel-sm">
                  {{ contact.icon }}
                </div>
                <div>
                  <div class="font-pixel text-xs">{{ contact.name }}</div>
                  <div class="font-vt323 text-sm text-gray-600">{{ contact.address }}</div>
                </div>
              </div>
            </div>
            <div v-if="savedContacts.length === 0" class="text-center py-8 text-gray-400 font-vt323">
              暂无保存的地址
            </div>
          </div>

          <template #footer>
            <PixelButton block variant="secondary" @click="showContacts = false">关闭</PixelButton>
          </template>
        </PixelCard>
      </div>
    </div>

    <!-- Scanner Modal -->
    <div v-if="showScanner" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div class="w-full max-w-md">
        <PixelCard>
          <template #header>
            <div class="flex justify-between items-center">
              <span>扫描二维码</span>
              <button @click="closeScanner" class="hover:text-red-500">✕</button>
            </div>
          </template>
          
          <div class="py-6">
            <div class="w-full h-64 bg-black/10 border-4 border-dashed border-black flex items-center justify-center mb-4">
              <div class="text-center">
                <div class="text-4xl mb-2">📷</div>
                <div class="font-pixel text-xs text-gray-500">请允许访问摄像头权限</div>
                <div class="font-vt323 text-sm text-gray-400 mt-2">或手动输入地址</div>
              </div>
            </div>
            <div class="space-y-2">
              <label class="block font-pixel text-xs">手动输入二维码内容</label>
              <input 
                v-model="scannedAddress" 
                type="text" 
                placeholder="粘贴二维码内容..." 
                class="w-full p-3 font-vt323 text-lg border-2 border-black shadow-pixel-sm focus:outline-none"
                @keyup.enter="applyScannedAddress"
              >
            </div>
          </div>

          <template #footer>
            <div class="flex gap-4 w-full">
              <PixelButton block variant="secondary" @click="closeScanner">取消</PixelButton>
              <PixelButton block variant="primary" @click="applyScannedAddress">确认</PixelButton>
            </div>
          </template>
        </PixelCard>
      </div>
    </div>

    <!-- Receive Modal -->
    <div v-if="showReceiveModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div class="w-full max-w-sm text-center">
        <PixelCard>
          <template #header>
            <div class="flex justify-between items-center">
              <span>收款码</span>
              <button @click="showReceiveModal = false" class="hover:text-red-500">✕</button>
            </div>
          </template>
          
          <div class="flex flex-col items-center gap-4 py-6">
            <div class="w-48 h-48 bg-white border-4 border-black p-2">
              <!-- QR Code -->
              <img :src="qrCodeUrl" alt="QR Code" class="w-full h-full image-pixelated" />
            </div>
            <div class="font-vt323 text-xl bg-gray-100 px-4 py-2 border border-black break-all">
              {{ truncatedAddress }}
            </div>
            <PixelButton size="sm" variant="secondary" @click="copyAddress">复制地址</PixelButton>
          </div>
        </PixelCard>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PixelCard from '~/components/pixel/PixelCard.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'
import PixelAvatar from '~/components/pixel/PixelAvatar.vue'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'default'
})

const toast = useToast()

const showSendModal = ref(false)
const showReceiveModal = ref(false)
const showContacts = ref(false)
const showScanner = ref(false)
const showChainSelector = ref(false)

const walletAddress = ref('0x9bb3a8c5d4e6f7a8b9c0d1e2f3a4b5c6d7e8f9ac6A')

const truncatedAddress = computed(() => {
  if (walletAddress.value.length <= 10) return walletAddress.value
  return `${walletAddress.value.slice(0, 6)}...${walletAddress.value.slice(-4)}`
})

const qrCodeUrl = computed(() => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${walletAddress.value}`
})

const currentChain = ref({
  id: 10,
  name: 'OP Mainnet',
  shortName: 'OP',
  nativeCurrency: {
    symbol: 'ETH'
  }
})

const availableChains = ref([
  {
    id: 10,
    name: 'OP Mainnet',
    shortName: 'OP',
    nativeCurrency: {
      symbol: 'ETH'
    }
  },
  {
    id: 1,
    name: 'Ethereum',
    shortName: 'ETH',
    nativeCurrency: {
      symbol: 'ETH'
    }
  },
  {
    id: 8453,
    name: 'Base',
    shortName: 'BASE',
    nativeCurrency: {
      symbol: 'ETH'
    }
  },
  {
    id: 42161,
    name: 'Arbitrum One',
    shortName: 'ARB',
    nativeCurrency: {
      symbol: 'ETH'
    }
  }
])

const copyAddress = async () => {
  const text = walletAddress.value
  
  // 优先使用现代 Clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      toast.add({ title: '地址已复制到剪贴板', color: 'green' })
      return
    } catch (err) {
      console.error('Clipboard API 失败:', err)
    }
  }
  
  // 备用方案：使用传统方法
  try {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)
    
    if (successful) {
      toast.add({ title: '地址已复制到剪贴板', color: 'green' })
    } else {
      throw new Error('execCommand 失败')
    }
  } catch (err) {
    console.error('复制失败:', err)
    // 最后的备用方案：提示用户手动复制
    toast.add({ title: `请手动复制: ${text}`, color: 'red' })
  }
}

const selectChain = (chain: any) => {
  currentChain.value = chain
  showChainSelector.value = false
  // 这里可以添加切换链的实际逻辑
  toast.add({ title: `已切换到 ${chain.name}`, color: 'green' })
}

const sendForm = ref({
  recipient: '',
  amount: '',
  note: ''
})

const scannedAddress = ref('')

const transactions = ref([
  { id: 1, type: 'in', title: '帮助 Mario 修水管', date: '2023-10-24 14:30', amount: 50, currency: 'CP' },
  { id: 2, type: 'out', title: '购买体力药水', date: '2023-10-23 09:15', amount: 0.05, currency: 'ETH' },
  { id: 3, type: 'in', title: '任务奖励', date: '2023-10-22 18:00', amount: 100, currency: 'CP' },
  { id: 4, type: 'in', title: 'Luigi 转账', date: '2023-10-20 11:20', amount: 0.5, currency: 'ETH' },
])

const savedContacts = ref([
  { id: 1, name: 'Mario', address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', icon: '🍄' },
  { id: 2, name: 'Luigi', address: '0x9bb3a8c5d4e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b', icon: '🟢' },
  { id: 3, name: 'Peach', address: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1', icon: '👑' },
])

const badges = ref([
  { id: 1, name: '热心助人', icon: '🍄' },
  { id: 2, name: '社区之星', icon: '🌟' },
  { id: 3, name: '建设者', icon: '🔨' },
])

const openScanner = () => {
  showScanner.value = true
  // 这里可以集成实际的二维码扫描库，如 html5-qrcode
  // 目前提供手动输入选项
}

const closeScanner = () => {
  showScanner.value = false
  scannedAddress.value = ''
}

const applyScannedAddress = () => {
  if (scannedAddress.value) {
    sendForm.value.recipient = scannedAddress.value
    closeScanner()
  }
}

const selectContact = (contact: any) => {
  sendForm.value.recipient = contact.address
  showContacts.value = false
}

const closeSendModal = () => {
  showSendModal.value = false
  sendForm.value = {
    recipient: '',
    amount: '',
    note: ''
  }
}

const handleSend = () => {
  if (!sendForm.value.recipient || !sendForm.value.amount) {
    alert('请填写接收方和金额')
    return
  }

  // 创建新交易记录
  const now = new Date()
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  
  const newTransaction = {
    id: transactions.value.length + 1,
    type: 'out' as const,
    title: sendForm.value.note || '转账',
    date: dateStr,
    amount: parseFloat(sendForm.value.amount),
    currency: 'ETH' // 可以根据实际情况选择货币类型
  }

  // 添加到交易记录列表的最前面
  transactions.value.unshift(newTransaction)

  // 关闭模态框并重置表单
  closeSendModal()
  
  // 这里可以添加实际的发送逻辑，调用API等
  console.log('发送资产:', sendForm.value)
}
</script>

<style scoped>
.image-pixelated {
  image-rendering: pixelated;
}
</style>
