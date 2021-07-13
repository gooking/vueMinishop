import Cookies from 'js-cookie'

const TokenKey = 'vueshop-token'

export function getToken() {
  // return '507d320c-c64a-432c-8696-80de8a3669d9'
  return Cookies.get(TokenKey)
}

export function getUid() {
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
