import Cookies from 'js-cookie'

const TokenKey = 'vueshop-token'

export function getToken() {
  // return 'af87fd6d-56e6-4871-a499-10430fde0c54'
  return Cookies.get(TokenKey)
}

export function getUid() {
  // 2091470 测试账号
  return Cookies.get('vueshop-uid')
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function setUid(uid) {
  return Cookies.set('vueshop-uid', uid)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setInvite(inviteId) {
  return Cookies.set('vueshop-invite', inviteId)
}

export function getInvite() {
  return Cookies.get('vueshop-invite')
}
