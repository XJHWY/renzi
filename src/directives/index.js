
export const imgError = {
  // 数据更新的时候就执行
  update (el, binding) {
    el.onerror = function () {
      el.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
    }
  }
}
