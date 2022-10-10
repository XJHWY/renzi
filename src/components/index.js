import PageTool from './PageTool/'
import UploadImage from './UploadImage/index.vue'
import FullScreen from './FullScreen/index.vue'
export default {
  install (Vue) {
    Vue.component('PageTool', PageTool)
    Vue.component('UploadImage', UploadImage)
    Vue.component('FullScreen', FullScreen)
  }
}
