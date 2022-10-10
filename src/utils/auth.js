import Cookies from 'js-cookie'

const TokenKey = 'hr-vue-admin'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}

// 保存时间戳
const TimeKey = 'hr-vue-admin-timeKey'

export function getTime () {
  return Cookies.get(TimeKey)
}

export function setTime (time) {
  return Cookies.set(TimeKey, time)
}

