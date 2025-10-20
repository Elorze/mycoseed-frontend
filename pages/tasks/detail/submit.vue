<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto px-6 py-8">
      <!-- 返回按钮 -->
      <div class="mb-8">
        <button
          @click="navigateTo('/tasks/' + taskId)"
          class="mb-4 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group cursor-pointer"
        >
          <UIcon name="i-heroicons-arrow-left" class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span class="font-medium">返回任务详情</span>
        </button>
      </div>

      <!-- 提交表单 -->
      <div class="max-w-4xl mx-auto">
        <div class="bg-card border border-border rounded-xl p-6">
          <h1 class="text-3xl font-bold text-foreground mb-2">提交任务</h1>
          <p class="text-muted-foreground mb-8">请上传您的任务完成证明和相关文件</p>
          
          <form @submit.prevent="submitForm" class="space-y-6">
            <!-- 任务信息 -->
            <div class="bg-muted/50 rounded-lg p-4">
              <h3 class="text-lg font-semibold text-foreground mb-2">{{ task.title }}</h3>
              <p class="text-muted-foreground">{{ task.description }}</p>
              <div class="flex items-center gap-4 mt-2">
                <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {{ task.reward }} ETH
                </span>
                <span class="text-sm text-muted-foreground">截止: {{ formatDate(task.deadline) }}</span>
              </div>
            </div>

            <!-- 提交说明 -->
            <div>
              <h3 class="text-lg font-semibold text-foreground mb-2">提交说明</h3>
              <p class="text-muted-foreground">{{ task.submissionInstructions }}</p>
            </div>

            <!-- 文件上传 -->
            <div>
              <h3 class="text-lg font-semibold text-foreground mb-4">上传文件</h3>
              <div class="space-y-4">
                <!-- 主要证明文件 -->
                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    主要证明文件 <span class="text-destructive">*</span>
                  </label>
                  <div 
                    @click="triggerFileInput('main')"
                    class="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    :class="{ 'border-primary': dragOver }"
                    @dragover.prevent="dragOver = true"
                    @dragleave="dragOver = false"
                    @drop.prevent="handleFileDrop($event, 'main')"
                  >
                    <UIcon name="i-heroicons-cloud-arrow-up" class="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p class="text-foreground font-medium">点击上传或拖拽文件到此处</p>
                    <p class="text-sm text-muted-foreground mt-1">支持 PDF, DOC, DOCX, PNG, JPG 格式</p>
                    <p class="text-xs text-muted-foreground mt-1">最大 10MB</p>
                  </div>
                  <input
                    ref="mainFileInput"
                    type="file"
                    class="hidden"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    @change="handleFileSelect($event, 'main')"
                  />
                  
                  <!-- 已选择的文件 -->
                  <div v-if="selectedFiles.main" class="mt-3 p-3 bg-muted/50 rounded-lg">
                    <div class="flex items-center gap-3">
                      <UIcon name="i-heroicons-document" class="h-5 w-5 text-primary" />
                      <span class="text-sm text-foreground">{{ selectedFiles.main.name }}</span>
                      <span class="text-xs text-muted-foreground">({{ formatFileSize(selectedFiles.main.size) }})</span>
                      <UButton
                        @click="removeFile('main')"
                        size="sm"
                        color="gray"
                        variant="ghost"
                        class="ml-auto"
                      >
                        移除
                      </UButton>
                    </div>
                  </div>
                </div>

                <!-- 附加文件 -->
                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    附加文件 (可选)
                  </label>
                  <div 
                    @click="triggerFileInput('additional')"
                    class="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <UIcon name="i-heroicons-plus" class="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p class="text-sm text-foreground">添加更多文件</p>
                  </div>
                  <input
                    ref="additionalFileInput"
                    type="file"
                    multiple
                    class="hidden"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    @change="handleFileSelect($event, 'additional')"
                  />
                  
                  <!-- 已选择的附加文件 -->
                  <div v-if="selectedFiles.additional.length > 0" class="mt-3 space-y-2">
                    <div
                      v-for="(file, index) in selectedFiles.additional"
                      :key="index"
                      class="p-3 bg-muted/50 rounded-lg"
                    >
                      <div class="flex items-center gap-3">
                        <UIcon name="i-heroicons-document" class="h-5 w-5 text-primary" />
                        <span class="text-sm text-foreground">{{ file.name }}</span>
                        <span class="text-xs text-muted-foreground">({{ formatFileSize(file.size) }})</span>
                        <UButton
                          @click="removeFile('additional', index)"
                          size="sm"
                          color="gray"
                          variant="ghost"
                          class="ml-auto"
                        >
                          移除
                        </UButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 提交说明 -->
            <div>
              <label class="block text-sm font-medium text-foreground mb-2">
                提交说明 <span class="text-destructive">*</span>
              </label>
              <UTextarea
                v-model="submissionDescription"
                placeholder="请详细描述您完成的任务内容，包括主要工作、技术实现、遇到的问题和解决方案等..."
                rows="6"
                class="w-full"
              />
            </div>

            <!-- 提交按钮 -->
            <div class="flex gap-4 pt-6 border-t border-border">
              <UButton
                @click="navigateTo('/tasks/' + taskId)"
                color="gray"
                variant="ghost"
                size="lg"
              >
                取消
              </UButton>
              <UButton
                type="submit"
                color="primary"
                size="lg"
                :disabled="!canSubmit"
                :loading="isSubmitting"
              >
                {{ isSubmitting ? '提交中...' : '提交任务' }}
              </UButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 获取路由参数
const route = useRoute()
const taskId = route.params.id

// 响应式数据
const selectedFiles = ref({
  main: null,
  additional: []
})
const submissionDescription = ref('')
const isSubmitting = ref(false)
const dragOver = ref(false)

// 文件输入引用
const mainFileInput = ref(null)
const additionalFileInput = ref(null)

// 任务数据
const task = ref({
  id: taskId,
  title: '完成项目提案',
  description: '提交一份完整的项目提案文档，包括技术方案、商业模式、团队介绍等',
  reward: 0.5,
  deadline: '2025-10-25',
  submissionInstructions: '请将完整的项目提案文档以PDF格式提交，文件大小不超过10MB。'
})

// 计算属性
const canSubmit = computed(() => {
  return selectedFiles.value.main && submissionDescription.value.trim().length > 0
})

// 触发文件输入
const triggerFileInput = (type) => {
  if (type === 'main') {
    mainFileInput.value?.click()
  } else {
    additionalFileInput.value?.click()
  }
}

// 处理文件选择
const handleFileSelect = (event, type) => {
  const files = Array.from(event.target.files)
  if (type === 'main') {
    selectedFiles.value.main = files[0]
  } else {
    selectedFiles.value.additional = [...selectedFiles.value.additional, ...files]
  }
}

// 处理文件拖拽
const handleFileDrop = (event, type) => {
  dragOver.value = false
  const files = Array.from(event.dataTransfer.files)
  if (type === 'main') {
    selectedFiles.value.main = files[0]
  } else {
    selectedFiles.value.additional = [...selectedFiles.value.additional, ...files]
  }
}

// 移除文件
const removeFile = (type, index) => {
  if (type === 'main') {
    selectedFiles.value.main = null
  } else {
    selectedFiles.value.additional.splice(index, 1)
  }
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 格式化日期
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 提交表单
const submitForm = async () => {
  if (!canSubmit.value) return
  
  isSubmitting.value = true
  
  try {
    // 创建FormData
    const formData = new FormData()
    formData.append('taskId', taskId)
    formData.append('description', submissionDescription.value)
    
    if (selectedFiles.value.main) {
      formData.append('mainFile', selectedFiles.value.main)
    }
    
    selectedFiles.value.additional.forEach((file, index) => {
      formData.append(`additionalFile${index}`, file)
    })
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('提交任务:', {
      taskId,
      description: submissionDescription.value,
      files: {
        main: selectedFiles.value.main?.name,
        additional: selectedFiles.value.additional.map(f => f.name)
      }
    })
    
    // 提交成功后跳转到任务详情页，并更新任务状态
    await navigateTo('/tasks/' + taskId + '?submitted=true')
    
  } catch (error) {
    console.error('提交失败:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
