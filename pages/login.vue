<template>
  <div class="flex flex-col container-size rounded-xl bg-[var(--ui-bg)] shadow-lg p-4">
    <UButton
      icon="i-heroicons-arrow-left"
      variant="ghost"
      class="self-start mb-4"
      @click="router.push('/')"
    >
      返回
    </UButton>
    <div class="flex flex-col items-center justify-center h-full gap-4 py-8 w-[80%] mx-auto">
      <h1 class="text-2xl font-bold">登录</h1>
      <div>输入登录手机号</div>
      <UForm :state="formState" @submit="onSubmit" class="w-full">
        <UFormField name="phone">
          <UInput
            size="xl"
            class="w-full"
            v-model="formState.phone"
            placeholder="请输入手机号"
            :ui="{ base: 'w-full' }"
            :disabled="loading"
          />
        </UFormField>
        <UButton
          type="submit"
          color="primary"
          class="w-full mt-4 flex justify-center items-center"
          size="xl"
          :loading="loading"
          :disabled="loading || !formState.phone"
        >
          发送验证码
        </UButton>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { sendSMS } from '../../../semi/semi-app-main/utils/semi_api' // 已注释，使用本地mock API
import { sendSMS } from '~/utils/api'

definePageMeta({
  layout: 'unauth'
})

const router = useRouter()
const loading = ref(false)
const toast = useToast()

const formState = reactive({
  phone: ''
})

const validatePhone = (value: string) => {
  if (!value) return '请输入手机号'
  if (!/^\d{11}$/.test(value)) return '请输入11位数字手机号'
  return true
}

const onSubmit = async () => {
  loading.value = true
  try {
    const validation = validatePhone(formState.phone)
    if (validation === true) {
      await sendSMS(formState.phone)
      toast.add({
        title: '验证码已发送',
        description: '请查收短信验证码'
      })
      await router.push(`/verifyphone?phone=${formState.phone}`)
    } else {
      toast.add({
        title: '手机号格式错误',
        description: validation
      })
    }
  } catch (error) {
    console.error('发送验证码失败:', error)
    toast.add({
      title: '发送失败',
      description: '请稍后重试'
    })
  } finally {
    loading.value = false
  }
}
</script>