import { defineStore } from 'pinia'
// 直接导入 semi 的 API - 已注释，使用本地mock API
// import { AUTH_TOKEN_KEY, getCookie, clearAuthToken, getMe } from '../../../semi/semi-app-main/utils/semi_api'
import { AUTH_TOKEN_KEY, getCookie, clearAuthToken, getMe } from '~/utils/api'

export interface User {
    id: number
    identifier: string
    identifierType: 'phone' | 'email'
    evm_chain_address: string
    encrypted_keys?: string | null
    userType: 'member' | 'community'
    isProfileSetup: boolean
    name?: string
    bio?: string
    avatar?: string
    description?: string
    created_at: string
}

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as User | null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.user,
        isMember: (state) => state.user?.userType === 'member',
        isCommunity: (state) => state.user?.userType === 'community',
        needsProfileSetup: (state) => state.user && !state.user.isProfileSetup,
    },
    actions: {
        async getUser(force = false) {
            if (this.user && !force) {
                return this.user
            }
            
            if (getCookie(AUTH_TOKEN_KEY)) {
              // 在 store 中获取运行时配置
              const config = useRuntimeConfig()
              const apiBaseUrl = config.public.apiUrl || 'http://localhost:3001'
              const user = await getMe(apiBaseUrl)
              this.user = user
              return user
            }

            return null
        },
        async signout() {
            clearAuthToken()
            this.user = null
        },
        setUser(user: User | null) {
            this.user = user
        }
    }
})