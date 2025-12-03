<template>
  <div class="relative h-[calc(100vh-140px)] -mx-4 -my-8 overflow-hidden">
    <!-- Graph Layer -->
    <ClientOnly>
      <NetworkCanvas @nodeClick="handleNodeClick" />
      <template #fallback>
        <div class="w-full h-full flex items-center justify-center bg-mario-sky">
          <div class="text-center">
            <span class="font-pixel text-2xl animate-pulse text-white text-shadow-pixel block mb-4">正在加载世界...</span>
            <div class="flex gap-2 justify-center">
              <div class="w-2 h-2 bg-white border border-black animate-bounce" style="animation-delay: 0s"></div>
              <div class="w-2 h-2 bg-white border border-black animate-bounce" style="animation-delay: 0.2s"></div>
              <div class="w-2 h-2 bg-white border border-black animate-bounce" style="animation-delay: 0.4s"></div>
            </div>
          </div>
        </div>
      </template>
    </ClientOnly>

    <!-- UI Overlay Layer -->
    <div class="absolute inset-0 pointer-events-none p-4 md:p-8">
      
      <!-- Floating decorative elements for pixel feel -->
      <div class="absolute top-20 left-8 pointer-events-none animate-float">
        <div class="w-4 h-4 bg-mario-coin border-2 border-black shadow-pixel-sm"></div>
      </div>
      <div class="absolute top-32 right-12 pointer-events-none animate-float-delayed">
        <div class="w-3 h-3 bg-mario-red border-2 border-black shadow-pixel-sm"></div>
      </div>
      <div class="absolute bottom-32 left-16 pointer-events-none animate-float-slow">
        <div class="w-3 h-3 bg-mario-green border-2 border-black shadow-pixel-sm"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NetworkCanvas from '~/components/graph/NetworkCanvas.vue'

// Use definePageMeta to ensure layout is applied
definePageMeta({
  layout: 'default'
})

const router = useRouter()

const handleNodeClick = (node: any) => {
  if (node.type === 'COMMUNITY') {
    // Mock ID mapping: comm1 -> 1
    const id = node.id.replace('comm', '') || '1'
    router.push(`/community/${id}`)
  } else if (node.type === 'USER') {
    // Mock ID mapping: user1 -> 1
    const id = node.id.replace('user', '') || '1'
    router.push(`/member/${id}`)
  }
}
</script>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(5deg);
  }
}

@keyframes float-delayed {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(-5deg);
  }
}

@keyframes float-slow {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-8px) rotate(3deg);
  }
}

@keyframes pulse-hover {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.animate-slide-down {
  animation: slide-down 0.6s ease-out;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 4s ease-in-out infinite;
  animation-delay: 1s;
}

.animate-float-slow {
  animation: float-slow 5s ease-in-out infinite;
  animation-delay: 2s;
}

.animate-pulse-hover {
  animation: pulse-hover 2s ease-in-out infinite;
}

.animate-pulse-hover:hover {
  animation: none;
  transform: scale(1.1);
}
</style>
