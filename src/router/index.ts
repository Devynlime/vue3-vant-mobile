import { createRouter, createWebHashHistory } from 'vue-router/auto'
import { handleHotUpdate, routes } from 'vue-router/auto-routes'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import type { EnhancedRouteLocation } from './types'
import useRouteCacheStore from '@/stores/modules/routeCache'
import { useUserStore } from '@/stores'
import { isLogin } from '@/utils/auth'

NProgress.configure({ showSpinner: true, parent: '#app' })

const router = createRouter({
  history: createWebHashHistory(), // 使用hash模式[适配i国网平台]
  // history: createWebHistory(import.meta.env.VITE_APP_PUBLIC_PATH), // 使用history模式[需要知道根路径]
  routes,
})

// This will update routes at runtime without reloading the page
if (import.meta.hot) {
  handleHotUpdate(router)
}

router.beforeEach(async (to: EnhancedRouteLocation, _from, next) => {
  NProgress.start()

  const routeCacheStore = useRouteCacheStore()
  const userStore = useUserStore()

  // Route cache
  routeCacheStore.addRoute(to)

  // 如果用户已登录且没有用户信息，则获取用户信息
  if (isLogin() && !userStore.userInfo?.name)
    await userStore.info()

  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
