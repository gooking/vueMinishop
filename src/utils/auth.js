import Cookies from 'js-cookie'

const TokenKey = 'vueshop-token'

export function getToken() {
  // return 'db11fdff-73e5-44ac-8f48-c7bf08c4fe8e'
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
