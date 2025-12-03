<template>
  <div class="w-full max-w-md">
    <PixelCard>
      <template #header>
        <div class="text-center font-pixel text-xl text-mario-red">INSERT COIN</div>
      </template>

      <div class="flex flex-col gap-6 py-4">
        <div class="text-center font-vt323 text-2xl">START GAME</div>
        
        <div class="space-y-4">
          <label class="block font-pixel text-xs uppercase text-gray-600">Phone Number</label>
          <input 
            v-model="formState.phone"
            type="tel"
            placeholder="13800000000"
            class="w-full h-12 px-4 bg-gray-50 border-2 border-black font-vt323 text-xl focus:outline-none focus:shadow-pixel-sm"
            :disabled="loading"
          />
        </div>

        <PixelButton 
          variant="primary" 
          block 
          size="lg"
          :disabled="loading || !formState.phone"
          @click="onSubmit"
        >
          {{ loading ? 'LOADING...' : 'SEND CODE' }}
        </PixelButton>

        <PixelButton 
          variant="secondary" 
          block 
          @click="router.push('/')"
        >
          BACK TO MAP
        </PixelButton>
      </div>

      <template #footer>
        <div class="w-full text-center text-xs text-gray-400 font-pixel uppercase">
          Web3 Login Powered by AA
        </div>
      </template>
    </PixelCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { sendSMS } from '~/utils/api'
import PixelCard from '~/components/pixel/PixelCard.vue'
import PixelButton from '~/components/pixel/PixelButton.vue'

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
  if (!value) return 'Please enter phone number'
  if (!/^\d{11}$/.test(value)) return 'Must be 11 digits'
  return true
}

const onSubmit = async () => {
  loading.value = true
  try {
    const validation = validatePhone(formState.phone)
    if (validation === true) {
      await sendSMS(formState.phone)
      toast.add({
        title: 'CODE SENT',
        description: 'Check your SMS'
      })
      await router.push(`/verifyphone?phone=${formState.phone}`)
    } else {
      toast.add({
        title: 'ERROR',
        description: validation
      })
    }
  } catch (error) {
    console.error('Send failed:', error)
    toast.add({
      title: 'FAILED',
      description: 'Try again later'
    })
  } finally {
    loading.value = false
  }
}
</script>
