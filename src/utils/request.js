import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTime } from './auth'
import router from '@/router'
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 50000
})

// 添加请求拦截器
request.interceptors.request.use(function (config) {
  const token = store.state.user.token
  if (token) {
    const time = Date.now() - getTime()
    // 2 * 60 * 60 * 1000  两小时
    if (time > 7200000) {
      store.dispatch('user/logOut')
      router.push('/login')
    }
    config.headers['Authorization'] = 'Bearer ' + token
    // config.headers = {
    //   Authorization: 'Bearer ' + token
    // }
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  const { data, success, message } = response.data
  if (success) {
    return data
  } else {
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, function (error) {
  if (error.response && error.response.data && error.response.data.code === 10002) {
    store.dispatch('user/logOut')
    router.push('/login')
  }
  // 对响应错误做点什么
  return Promise.reject(error)
})
export default request
