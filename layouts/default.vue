<template>
  <div class="min-h-screen bg-background">
    <LayoutHeader 
      :current-page="currentPage" 
      @navigate="handleNavigate" 
    />
    <main class="relative">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
const currentPage = ref('hub')

const handleNavigate = (page: string) => {
  currentPage.value = page
  // 这里可以添加路由导航逻辑
  if (page === 'hub') {
    navigateTo('/')
  } else if (page === 'wallet') {
    navigateTo('/wallet')
  }
}
</script>
