import { useUserStore } from '~/stores/user'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // 允许访问的公开页面（不需要登录）
  const publicPages = ['/login', '/verify', '/verifyphone']
  
  // 允许访问的设置页面（即使没有昵称也可以访问）
  const setupPages = ['/profile/setup', '/community/setup']

  // 如果访问的是公开页面或设置页面，直接放行
  if (publicPages.some(path => to.path.startsWith(path)) || 
      setupPages.some(path => to.path.startsWith(path))) {
    return
  }

  // 检查是否有认证token
  if (typeof window !== 'undefined') {
    const userStore = useUserStore()
    const user = await userStore.getUser()

    // 如果用户已登录但没有设置昵称，强制跳转到设置页面
    if (user && !user.name) {
      const userType = user.userType || 'member'
      if (userType === 'community') {
        return navigateTo('/community/setup')
      } else {
        return navigateTo('/profile/setup')
      }
    }
  }
})

