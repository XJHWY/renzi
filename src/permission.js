import router from '@/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'

const writeList = ['/login', '/404']

router.beforeEach(async (to, from, next) => {
  // 开启进度效果
  NProgress.start()
  if (store.state.user.token) {
    if (to.path === '/login') {
      NProgress.done()
      next('/')
    } else {
      if (!store.state.user.userInfo.id) {
        const userInfo = await store.dispatch('user/getInfo')
        console.log(userInfo)
        const newRoutes = await store.dispatch('permissions/filterRoutes', userInfo.roles.menus)
        router.addRoutes([...newRoutes, { path: '*', redirect: '/404', hidden: true }])
        next(to.path)
      }
      next()
    }
  } else {
    if (writeList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})

router.afterEach(() => {
  // 关闭进度效果
  NProgress.done()
})
