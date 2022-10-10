import { setToken, getToken, removeToken, setTime } from '@/utils/auth'

import { login, getInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
const state = {
  token: getToken(),
  userInfo: {},
  count: 0
}
const mutations = {
  setToken (state, payload) {
    state.token = payload
  },
  setUserInfo (state, payload) {
    state.userInfo = payload
  },
  removeToken (state) {
    state.token = null
    removeToken()
  },
  removeUserInfo (state) {
    state.userInfo = {}
  }

}
const actions = {
  async login (context, payload) {
    const res = await login(payload)
    context.commit('setToken', res)
    setToken(res)
    setTime(Date.now())
  },
  async getInfo (context, payload) {
    const res = await getInfo()
    console.log(res)
    const res1 = await getUserDetailById(res.userId)
    console.log(res1)
    context.commit('setUserInfo', { ...res, ...res1 })
    return res
  },
  logOut (context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
    resetRouter()
    context.commit('permission/setRoutes', [], { root: true })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

