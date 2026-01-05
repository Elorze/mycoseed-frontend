<template>
  <div class="w-full max-w-md">
    <PixelCard>
      <template #header>
        <div class="text-center font-pixel text-xl text-mario-red">登录</div>
      </template>

      <div class="flex flex-col gap-6 py-4">
        
        <!-- 输入类型切换 -->
        <div class="flex gap-2 border-2 border-black">
          <button
            @click="inputType = 'phone'"
            :class="[
              'flex-1 py-2 font-pixel text-sm transition-colors',
              inputType === 'phone' ? 'bg-mario-red text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            ]"
          >
            手机号
          </button>
          <button
            @click="inputType = 'email'"
            :class="[
              'flex-1 py-2 font-pixel text-sm transition-colors',
              inputType === 'email' ? 'bg-mario-red text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            ]"
          >
            邮箱
          </button>
        </div>

        <!-- 用户类型选择（仅注册时显示） -->
        <div v-if="!isLoginMode" class="space-y-2">
          <label class="block font-pixel text-xs uppercase text-gray-600">注册类型</label>
          <div class="flex gap-2 border-2 border-black">
            <button
              @click="formState.userType = 'member'"
              :class="[
                'flex-1 py-2 font-pixel text-sm transition-colors',
                formState.userType === 'member' ? 'bg-mario-green text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              ]"
            >
              成员
            </button>
            <button
              @click="formState.userType = 'community'"
              :class="[
                'flex-1 py-2 font-pixel text-sm transition-colors',
                formState.userType === 'community' ? 'bg-mario-green text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              ]"
            >
              社区
            </button>
          </div>
        </div>

        <!-- 输入框 -->
        <div class="space-y-4">
          <label class="block font-pixel text-xs uppercase text-gray-600">
            {{ inputType === 'phone' ? '手机号' : '邮箱地址' }}
          </label>
          <input 
            v-model="formState.identifier"
            :type="inputType === 'phone' ? 'tel' : 'email'"
            :placeholder="inputType === 'phone' ? '13800000000' : 'user@example.com'"
            class="w-full h-12 px-4 bg-gray-50 border-2 border-black font-vt323 text-xl focus:outline-none focus:shadow-pixel-sm"
            :disabled="loading"
          />
        </div>

        <!-- 登录/注册切换 -->
        <div class="flex items-center justify-center gap-2 text-sm">
          <span class="font-vt323 text-gray-600">
            {{ isLoginMode ? '还没有账号？' : '已有账号？' }}
          </span>
          <button
            @click="isLoginMode = !isLoginMode"
            class="font-pixel text-mario-red hover:underline"
          >
            {{ isLoginMode ? '注册' : '登录' }}
          </button>
        </div>

        <PixelButton 
          variant="primary" 
          block 
          size="lg"
          :disabled="loading || !formState.identifier || (!isLoginMode && !formState.userType)"
          @click="onSubmit"
        >
          {{ loading ? '加载中...' : isLoginMode ? '发送验证码' : '注册' }}
        </PixelButton>

        <PixelButton 
          variant="secondary" 
          block 
          @click="router.push('/')"
        >
          返回地图
        </PixelButton>
      </div>

      <template #footer>
        <div class="w-full text-center text-xs text-gray-400 font-pixel uppercase">
          由 AA 驱动的 Web3 登录
        </div>
      </template>
    </PixelCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useApi } from '~/composables/useApi'
import PixelCard from '~/components/pixel/PixelCard.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'

definePageMeta({
  layout: 'unauth'
})

const router = useRouter()
const loading = ref(false)
const toast = useToast()
const inputType = ref<'phone' | 'email'>('phone')
const isLoginMode = ref(true)
const { sendSMS, sendEmailCode, setCurrentIdentifier } = useApi()

const formState = reactive({
  identifier: '',
  userType: 'member' as 'member' | 'community'
})

const validateIdentifier = (value: string, type: 'phone' | 'email'): string | true => {
  if (!value) {
    return type === 'phone' ? '请输入手机号' : '请输入邮箱地址'
  }
  if (type === 'phone') {
    if (!/^\d{11}$/.test(value)) return '手机号必须是11位数字'
  } else {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return '请输入有效的邮箱地址'
  }
  return true
}

const onSubmit = async () => {
  loading.value = true
  try {
    const validation = validateIdentifier(formState.identifier, inputType.value)
    if (validation === true) {
      // 保存当前标识符和用户类型
      setCurrentIdentifier(formState.identifier)
      
      // 根据输入类型发送验证码
      if (inputType.value === 'phone') {
        await sendSMS(formState.identifier)
        toast.add({
          title: '验证码已发送',
          description: '请查看短信'
        })
      } else {
        await sendEmailCode(formState.identifier)
        toast.add({
          title: '验证码已发送',
          description: '请查看邮箱'
        })
      }
      
      // 跳转到验证页面，传递标识符、类型和用户类型
      const params = new URLSearchParams({
        identifier: formState.identifier,
        type: inputType.value,
        userType: formState.userType,
        isLogin: isLoginMode.value.toString()
      })
      await router.push(`/auth/verify?${params.toString()}`)
    } else {
      toast.add({
        title: '输入错误',
        description: validation
      })
    }
  } catch (error) {
    console.error('Send failed:', error)
    toast.add({
      title: '发送失败',
      description: '请稍后重试'
    })
  } finally {
    loading.value = false
  }
}
</script>

