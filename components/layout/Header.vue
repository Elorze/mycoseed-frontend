<template>
  <header class="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
      <!-- Logo -->
      <div 
        class="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
        @click="navigateTo('hub')"
      >
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary via-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-primary/20">
          <img src="/images/icons/myco-seed-logo.svg" alt="MycoSeed" class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-foreground font-bold text-lg">MycoSeed</h1>
          <p class="text-xs text-muted-foreground">decentralized autonomous community</p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex items-center gap-2">
        <UButton
          :variant="currentPage === 'wallet' ? 'solid' : 'ghost'"
          :color="currentPage === 'wallet' ? 'primary' : 'gray'"
          @click="navigateTo('wallet')"
          class="flex items-center gap-2"
        >
          <UIcon name="i-heroicons-wallet" class="h-4 w-4" />
          钱包
        </UButton>

        <!-- Wallet Address -->
        <div class="ml-4 px-4 py-2 rounded-lg bg-muted border border-border">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span class="text-sm text-foreground font-mono">0x742d...3f4a</span>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
interface Props {
  currentPage?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  navigate: [page: string]
}>()

const navigateTo = (page: string) => {
  emit('navigate', page)
}
</script>
