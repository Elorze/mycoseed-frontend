<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

// 重定向到 /tasks
const router = useRouter()
onMounted(() => {
  router.replace('/tasks')
})
</script>

<template>
  <div></div>
</template>
