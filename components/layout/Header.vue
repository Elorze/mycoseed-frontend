<template>
  <header class="h-16 md:h-20 border-b-4 border-black bg-white sticky top-0 z-50 shadow-pixel">
    <div class="w-full md:max-w-7xl md:mx-auto px-2 md:px-4 h-full flex items-center justify-between">
      <!-- Logo -->
      <div 
        class="flex items-center gap-3 cursor-pointer group"
        @click="navigateTo('hub')"
      >
        <div class="w-12 h-12 bg-mario-red border-4 border-black flex items-center justify-center shadow-pixel group-hover:-translate-y-1 transition-transform">
          <img src="/images/icons/myco-seed-logo.svg" alt="MycoSeed" class="w-8 h-8" style="image-rendering: pixelated;" />
        </div>
        <div class="hidden md:block">
          <h1 class="font-pixel text-black text-sm md:text-base leading-tight">菌丝计划</h1>
          <p class="font-vt323 text-gray-600 text-sm">WORLD 1-1</p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex items-center gap-4">
        
        <!-- Marketplace (Replacing Level Bar) -->
        <PixelButton
           variant="warning"
           size="sm"
           @click="navigateTo('market')"
        >
           🛒 商城
        </PixelButton>

        <!-- Wallet -->
        <PixelButton
          :variant="currentPage === 'wallet' ? 'primary' : 'secondary'"
          size="sm"
          @click="navigateTo('wallet')"
        >
          👛 钱包
        </PixelButton>

        <!-- User Avatar (Replacing Address) -->
        <div 
          class="cursor-pointer hover:scale-110 transition-transform"
          @click="navigateTo('profile')"
          title="个人主页"
        >
           <PixelAvatar 
            :src="currentUser?.avatar"
            :seed="currentUser?.name || 'user'"
            size="md"
           />
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import PixelButton from '~/components/pixel/PixelButton.vue'
import PixelAvatar from '~/components/pixel/PixelAvatar.vue'

interface Props {
  currentPage?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  navigate: [page: string]
}>()

const navigateTo = (page: string) => {
  if (page === 'profile') {
    // Mock ID 1 for current user
    emit('navigate', 'member/1')
  } else {
    emit('navigate', page)
  }
}
</script>
