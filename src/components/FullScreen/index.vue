<template>
    <span>
      <svg-icon icon-class="fullscreen" style="color:#fff; font-size:20px;margin-right:6px" @click="fullscreen"></svg-icon>
    </span>
</template>

<script>
import SvgIcon from '../SvgIcon/index.vue'
export default {
  filters: {},
  components: { SvgIcon },
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () { },
  methods: {
    fullscreen() {
      document.body.webkitRequestFullScreen()
    }
  }
}
</script>

<style scoped>
</style>
