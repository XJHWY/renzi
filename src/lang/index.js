import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enLocale from 'element-ui/lib/locale/lang/en'
import jaLocale from 'element-ui/lib/locale/lang/zh-CN'

Vue.use(VueI18n)

// 准备翻译的语言环境信息
const messages = {
  en: {
    message: {
      hello: 'hello world',
      calendar: 'calendar',
      ...enLocale
    }
  },
  ja: {
    message: {
      hello: 'こんにちは、世界',
      calendar: 'カレンダー',
      ...jaLocale
    }
  }
}
// 通过选项创建 VueI18n 实例
const i18n = new VueI18n({
  locale: 'ja', // 设置地区
  messages // 设置地区信息
})

export default i18n

