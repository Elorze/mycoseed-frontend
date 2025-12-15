import {AUTH_TOKEN_KEY, getCookie} from '~/utils/api'

export default defineNuxtRouteMiddleware((to, from) => {
    // 允许访问的公开页面（不需要登录）
    const publicPages = ['/login', '/verify', '/verifyphone']

    // 如果访问的是公开页面，直接放行
    if (publicPages.some(path => to.path.startsWith(path))) {
        return
    }

    // 检查是否有认证token
    if (typeof window !== 'undefined') {
        const token = getCookie(AUTH_TOKEN_KEY)

        // 如果没有token，重定向到登录页
        if (!token) {
            return navigateTo('/login')
        }
    }
})