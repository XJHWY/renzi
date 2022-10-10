import { asyncRoutes, constantRoutes } from '@/router'

const state = {
  routes: []
}
const mutations = {
  setRoutes (state, payload) {
    state.routes = payload
  }
}
const actions = {
  filterRoutes (context, menus) {
    const newRoutes = asyncRoutes.filter(item => menus.includes(item.meta.name))
    context.commit('setRoutes', [...newRoutes, ...constantRoutes])
    return newRoutes // 异步函数的本质还是函数
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
