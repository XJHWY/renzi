import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import '@/directives'

import '@/icons' // icon
import '@/permission' // permission control

import components from '@/components'
Vue.use(components)

import mixin from './mixin'
Vue.mixin(mixin)

Vue.directive('sync', {
  inserted: function (el, binding) {
    const value = binding.value
    const key = binding.arg
    const parent = el.parentNode
    let event = 'change'
    if (el.tagName === 'SELECT') {
      event = 'input'
    }
    parent.addEventListener(event, function (e) {
      value[key] = el.value
    })
  }
})

// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

import i18n from '@/lang'

import * as directives from '@/directives'
Object.keys(directives).forEach(item => {
  Vue.directive(item, directives[item])
})

import * as filters from '@/filters'

import Print from 'vue-print-nb'
// Global instruction
Vue.use(Print)

Object.keys(filters).forEach(item => {
  Vue.filter(item, filters[item])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
