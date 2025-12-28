<template>
  <div class="space-y-8">
    <!-- 社区广场标题 -->
    <div class="text-center mb-6">
      <h1 class="font-pixel text-2xl md:text-4xl text-black mb-2">社区广场</h1>
      <div class="w-24 md:w-32 h-1 bg-black mx-auto"></div>
    </div>

    <!-- 南塘社区卡片 -->
    <PixelCard>
      <div class="space-y-6">
        <!-- 社区标题和下拉框 -->
        <div class="flex items-center justify-between border-b-2 border-black pb-4">
          <h2 class="font-pixel text-lg uppercase text-black">南塘</h2>
          <button
            @click="showIntro = !showIntro"
            class="px-4 py-2 bg-white border-2 border-black shadow-pixel-sm font-vt323 text-sm transition-all hover:shadow-pixel hover:-translate-y-1"
          >
            {{ showIntro ? '收起' : '展开' }}
          </button>
        </div>

        <!-- 社区介绍（可展开/收起） -->
        <div v-if="showIntro" class="prose font-vt323 text-lg max-w-none p-4 bg-gray-50 border-2 border-black">
          <div class="whitespace-pre-wrap">{{ nantangIntro }}</div>
        </div>

        <!-- 社区信息（数据清空） -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 市政厅 -->
          <PixelCard>
            <template #header>市政厅 (TOWN HALL)</template>
            <div class="space-y-4 text-center">
              <div class="w-full h-24 bg-gray-100 flex items-center justify-center border-2 border-dashed border-black/20 relative overflow-hidden">
                <div class="absolute inset-0 flex items-center justify-center text-6xl opacity-20">🏰</div>
              </div>
              
              <!-- 社区统计（数据清空） -->
              <div class="grid grid-cols-2 gap-2 text-left font-vt323 text-lg bg-gray-50 p-2 border border-black/10">
                <div>南塘豆:</div>
                <div class="text-right text-mario-coin font-bold">0</div>
                <div>成员:</div>
                <div class="text-right font-bold">0</div>
              </div>

              <p class="text-sm text-gray-600 text-left">
                素舍提供乡村村民宿餐饮，体验乡村生活，感受自然之美。
              </p>
            </div>
          </PixelCard>

          <!-- 村民（数据清空） -->
          <PixelCard>
            <template #header>村民 (VILLAGERS)</template>
            <div class="text-center py-8 text-gray-400 font-vt323">
              暂无成员
            </div>
          </PixelCard>
        </div>
      </div>
    </PixelCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PixelCard from '~/components/pixel/PixelCard.vue'
import { useUserStore } from '~/stores/user'

// Use definePageMeta to ensure layout is applied
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const userStore = useUserStore()

// 控制展开/收起
const showIntro = ref(false)

// 南塘社区介绍文字
const nantangIntro = `# 南塘

欢迎来到南塘，素舍提供乡村村民宿餐饮服务。

## 我们的特色
- 乡村民宿体验
- 地道乡村餐饮
- 自然生态体验
- 南塘豆积分奖励

## 服务内容
- 民宿住宿服务
- 乡村特色餐饮
- 农事体验活动
- 乡村文化体验
`
</script>

<style scoped>
.prose {
  color: #000;
}

.prose h1 {
  font-family: 'Press Start 2P', cursive;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-transform: uppercase;
}

.prose h2 {
  font-family: 'Press Start 2P', cursive;
  font-size: 1rem;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
}

.prose ul {
  list-style: none;
  padding-left: 0;
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
}

.prose li {
  padding-left: 1.5rem;
  position: relative;
  margin-bottom: 0.5rem;
}

.prose li::before {
  content: '•';
  position: absolute;
  left: 0;
  font-weight: bold;
}
</style>