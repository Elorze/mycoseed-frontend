import { defineStore } from 'pinia'
// 直接导入 semi 的 API - 已注释，使用本地mock API
// import { AUTH_TOKEN_KEY, getCookie, clearAuthToken, getMe } from '../../../semi/semi-app-main/utils/semi_api'
import { AUTH_TOKEN_KEY, getCookie, clearAuthToken, getMe } from '~/utils/api'

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as any,
    }),
    actions: {
        async getUser(force = false) {
            if (this.user && !force) {
                return this.user
            }
            
            if (getCookie(AUTH_TOKEN_KEY)) {
              const user = await getMe()
              this.user = user
            }

            return null
        },
        async signout() {
            clearAuthToken()
            this.user = null
        },
        setUser(user: any) {
            this.user = user
        }
    }
})