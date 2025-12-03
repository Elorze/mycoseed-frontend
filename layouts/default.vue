<template>
  <div class="min-h-screen flex flex-col font-vt323 bg-mario-sky bg-[size:40px_40px]" style="background-image: linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);">
    <LayoutHeader 
      :current-page="currentPage" 
      @navigate="handleNavigate"
      class="hidden md:block"
    />
    
    <!-- Mobile Header (Simplified) -->
    <div class="md:hidden h-14 bg-white border-b-4 border-black flex items-center justify-center sticky top-0 z-50 shadow-pixel px-4">
      <div class="font-pixel text-lg">MycoSeed</div>
    </div>
    
    <main class="relative flex-grow w-full md:container md:mx-auto px-2 md:px-4 py-4 md:py-8 md:max-w-6xl mb-16 md:mb-0">
      <!-- Floating Cloud Decoration (CSS based) -->
      <div class="absolute top-10 left-10 w-16 h-8 bg-white/80 hidden md:block pixel-cloud opacity-50 -z-10"></div>
      <div class="absolute top-24 right-20 w-24 h-10 bg-white/80 hidden md:block pixel-cloud opacity-60 -z-10"></div>

      <NuxtPage />
    </main>

    <LayoutBottomNav />

    <!-- Footer Ground (Desktop Only) -->
    <footer class="h-16 w-full bg-mario-ground border-t-4 border-black relative overflow-hidden mt-auto hidden md:block">
      <!-- Grass Top -->
      <div class="absolute top-0 left-0 right-0 h-4 bg-mario-green border-b-4 border-black"></div>
      <!-- Brick Pattern overlay -->
      <div class="w-full h-full opacity-20" style="background-image: linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000); background-size: 20px 20px; background-position: 0 0, 10px 10px;"></div>
      
      <div class="absolute bottom-2 w-full text-center text-white/50 text-xs font-pixel">
        © 2024 MYCOSEED • PRESS START
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const currentPage = ref('hub')

const handleNavigate = (page: string) => {
  currentPage.value = page
  // Map 'hub' to root index, 'wallet' to /wallet (if it exists, or keep as placeholder)
  if (page === 'hub') {
    navigateTo('/')
  } else {
    // For now, assuming other routes follow the name
    navigateTo('/' + page)
  }
}
</script>

<style scoped>
.pixel-cloud {
  clip-path: polygon(
    20% 0%, 80% 0%, 
    100% 20%, 100% 80%, 
    80% 100%, 20% 100%, 
    0% 80%, 0% 20%
  );
}
</style>
